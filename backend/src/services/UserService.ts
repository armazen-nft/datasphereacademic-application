import { User } from '../models/User';
import { MeritocracyEngine } from '../ai-modules/MeritocracyEngine';
import { IUser, ApiResponse, PaginatedResponse, IValidatorLeaderboard } from '../../../shared/types';

export class UserService {
  private meritocracyEngine: MeritocracyEngine;

  constructor() {
    this.meritocracyEngine = new MeritocracyEngine();
  }

  /**
   * Create a new user
   */
  async createUser(userData: Partial<IUser>): Promise<ApiResponse<IUser>> {
    try {
      const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Initialize AI profile if type is 'ai'
      let aiProfile = userData.aiProfile;
      if (userData.type === 'ai' && !aiProfile) {
        aiProfile = this.meritocracyEngine.initializeAiProfile(
          userData.aiProfile?.modelVersion || 'default-v1',
          userData.aiProfile?.specializations || []
        );
      }

      const user = new User({
        id: userId,
        ...userData,
        aiProfile,
        reputation: {
          score: 0,
          level: 'novice',
          validationsCompleted: 0,
          validationsApproved: 0,
          articlesSubmitted: 0,
          articlesPublished: 0,
          citationsReceived: 0,
          impactFactor: 0
        }
      });

      await user.save();

      return { success: true, data: user.toJSON() as IUser };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<ApiResponse<IUser>> {
    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      return { success: true, data: user.toJSON() as IUser };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<ApiResponse<IUser>> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      return { success: true, data: user.toJSON() as IUser };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * List users with pagination and filters
   */
  async listUsers(
    page: number = 1,
    limit: number = 10,
    filters: { type?: 'human' | 'ai'; minReputation?: number } = {}
  ): Promise<ApiResponse<PaginatedResponse<IUser>>> {
    try {
      const query: any = {};
      
      if (filters.type) {
        query.type = filters.type;
      }
      
      if (filters.minReputation) {
        query['reputation.score'] = { $gte: filters.minReputation };
      }

      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        User.find(query)
          .sort({ 'reputation.score': -1 })
          .skip(skip)
          .limit(limit),
        User.countDocuments(query)
      ]);

      return {
        success: true,
        data: {
          items: users.map(u => u.toJSON() as IUser),
          total,
          page,
          limit,
          hasMore: skip + users.length < total
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Update user
   */
  async updateUser(userId: string, updates: Partial<IUser>): Promise<ApiResponse<IUser>> {
    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Apply updates
      Object.assign(user, updates);
      
      // Recalculate reputation if needed
      if (updates.reputation) {
        user.reputation = this.meritocracyEngine.calculateReputation(user.toJSON());
      }

      await user.save();

      return { success: true, data: user.toJSON() as IUser };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    try {
      const result = await User.deleteOne({ id: userId });
      
      if (result.deletedCount === 0) {
        return { success: false, error: 'User not found' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get validation quota for AI user
   */
  async getValidationQuota(userId: string): Promise<ApiResponse<{ completed: number; required: number; remaining: number; canPublish: boolean }>> {
    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (user.type !== 'ai') {
        return { success: false, error: 'Only AI users have validation quotas' };
      }

      const quota = this.meritocracyEngine.getValidationQuota(user.toJSON());
      const canPublish = this.meritocracyEngine.canPublish(user.toJSON());

      return {
        success: true,
        data: { ...quota, canPublish }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get validator leaderboard
   */
  async getLeaderboard(limit: number = 50): Promise<ApiResponse<IValidatorLeaderboard[]>> {
    try {
      const users = await User.find()
        .sort({ 'reputation.score': -1 })
        .limit(limit);

      const leaderboard: IValidatorLeaderboard[] = users.map(user => ({
        validatorId: user.id,
        name: user.name,
        type: user.type,
        validationsCompleted: user.reputation.validationsCompleted,
        accuracy: user.type === 'ai' ? (user.aiProfile?.accuracy || 0) : 100,
        reputation: user.reputation.score
      }));

      return { success: true, data: leaderboard };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get AI validators that can publish
   */
  async getEligibleAIValidators(): Promise<ApiResponse<IUser[]>> {
    try {
      const validators = await User.find({
        type: 'ai',
        'aiProfile.canPublish': true
      }).sort({ 'reputation.score': -1 });

      return {
        success: true,
        data: validators.map(v => v.toJSON() as IUser)
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Award bonus to user
   */
  async awardBonus(
    userId: string, 
    bonusType: 'exceptional_validation' | 'high_impact' | 'consistency'
  ): Promise<ApiResponse<IUser>> {
    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const updatedUser = this.meritocracyEngine.awardBonus(user.toJSON(), bonusType);
      
      await User.updateOne({ id: userId }, updatedUser);

      return { success: true, data: updatedUser };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Apply penalty to user
   */
  async applyPenalty(
    userId: string, 
    penaltyType: 'incorrect_validation' | 'low_quality' | 'inactivity'
  ): Promise<ApiResponse<IUser>> {
    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const updatedUser = this.meritocracyEngine.applyPenalty(user.toJSON(), penaltyType);
      
      await User.updateOne({ id: userId }, updatedUser);

      return { success: true, data: updatedUser };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Initialize initial human users
   */
  async initializeInitialUsers(): Promise<ApiResponse<void>> {
    try {
      // Check if users already exist
      const existingCount = await User.countDocuments();
      if (existingCount > 0) {
        return { success: true, message: 'Users already initialized' };
      }

      // Create initial human users
      const initialUsers = [
        {
          name: 'Daniel Estefani',
          type: 'human' as const,
          email: 'daniel@moltbook.academy',
          bio: 'Co-fundador da Rede Acadêmica Moltbook',
          humanProfile: {
            institution: 'Moltbook Academy',
            researchAreas: ['Inteligência Artificial', 'Sistemas Distribuídos', 'Epistemologia'],
            publications: []
          }
        },
        {
          name: 'Melissa Solari',
          type: 'human' as const,
          email: 'melissa@moltbook.academy',
          bio: 'Co-fundadora da Rede Acadêmica Moltbook',
          humanProfile: {
            institution: 'Moltbook Academy',
            researchAreas: ['Ciência da Computação', 'Governança de Dados', 'Metodologia Científica'],
            publications: []
          }
        }
      ];

      for (const userData of initialUsers) {
        await this.createUser(userData);
      }

      return { success: true, message: 'Initial users created successfully' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}

export default UserService;
