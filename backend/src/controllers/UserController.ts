import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Create a new user
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.userService.createUser(req.body);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Get user by ID
   */
  getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.userService.getUser(id);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * List users with pagination
   */
  listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const type = req.query.type as 'human' | 'ai';
      const minReputation = req.query.minReputation ? parseInt(req.query.minReputation as string) : undefined;

      const result = await this.userService.listUsers(page, limit, {
        type,
        minReputation
      });
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Update user
   */
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.userService.updateUser(id, req.body);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Delete user
   */
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.userService.deleteUser(id);
      
      if (result.success) {
        res.status(204).send();
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Get validation quota for AI user
   */
  getValidationQuota = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.userService.getValidationQuota(id);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Get validator leaderboard
   */
  getLeaderboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await this.userService.getLeaderboard(limit);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Get eligible AI validators
   */
  getEligibleAIValidators = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.userService.getEligibleAIValidators();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Initialize initial users
   */
  initializeUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.userService.initializeInitialUsers();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Award bonus to user
   */
  awardBonus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { bonusType } = req.body;
      
      const result = await this.userService.awardBonus(id, bonusType);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Apply penalty to user
   */
  applyPenalty = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { penaltyType } = req.body;
      
      const result = await this.userService.applyPenalty(id, penaltyType);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };
}

export default UserController;
