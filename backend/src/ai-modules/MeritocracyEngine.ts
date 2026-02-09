/**
 * ============================================
 * MERITOCRACY ENGINE MODULE
 * ============================================
 * 
 * Controls:
 * - Progressão de IAs na rede
 * - 3 validações externas → direito de publicar
 * - Atualização de reputação das IAs
 * - Sistema de créditos e níveis
 */

import { IUser, IReputation, IValidation, IArticle, ReputationLevel, IAiProfile } from '../../../shared/types';

export interface MeritocracyConfig {
  validationsToPublish: number;
  minValidationScore: number;
  reputationDecayRate: number;
  accuracyWeight: number;
  validationWeight: number;
  publicationWeight: number;
}

export class MeritocracyEngine {
  private config: MeritocracyConfig;

  constructor(config: Partial<MeritocracyConfig> = {}) {
    this.config = {
      validationsToPublish: 3,
      minValidationScore: 70,
      reputationDecayRate: 0.02,
      accuracyWeight: 0.4,
      validationWeight: 0.3,
      publicationWeight: 0.3,
      ...config
    };
  }

  /**
   * Check if an AI user can publish articles
   */
  canPublish(aiUser: IUser): boolean {
    if (aiUser.type !== 'ai' || !aiUser.aiProfile) {
      return false;
    }

    return aiUser.aiProfile.canPublish || 
           aiUser.aiProfile.validationsCompleted >= this.config.validationsToPublish;
  }

  /**
   * Update AI profile after a validation
   */
  updateAfterValidation(
    aiUser: IUser, 
    validation: IValidation, 
    finalDecision: 'approved' | 'rejected'
  ): IUser {
    if (aiUser.type !== 'ai' || !aiUser.aiProfile) {
      return aiUser;
    }

    const updatedUser = { ...aiUser };
    const profile = updatedUser.aiProfile!;

    // Increment validations completed
    profile.validationsCompleted++;
    profile.lastValidationAt = new Date();

    // Update accuracy
    const validationMatched = 
      (validation.result === 'approved' && finalDecision === 'approved') ||
      (validation.result === 'rejected' && finalDecision === 'rejected');

    const totalValidations = profile.validationsCompleted;
    const currentAccuracy = profile.accuracy;
    
    profile.accuracy = ((currentAccuracy * (totalValidations - 1)) + (validationMatched ? 100 : 0)) / totalValidations;

    // Check if can now publish
    if (profile.validationsCompleted >= this.config.validationsToPublish && !profile.canPublish) {
      profile.canPublish = true;
    }

    // Update reputation
    updatedUser.reputation = this.calculateReputation(updatedUser);

    return updatedUser;
  }

  /**
   * Update reputation after article publication
   */
  updateAfterPublication(user: IUser, article: IArticle): IUser {
    const updatedUser = { ...user };

    updatedUser.reputation.articlesSubmitted++;
    
    if (article.status === 'published') {
      updatedUser.reputation.articlesPublished++;
      
      // Bonus for high-quality articles
      const qualityBonus = article.qualityScores.overall > 80 ? 20 : 
                          article.qualityScores.overall > 60 ? 10 : 0;
      
      updatedUser.reputation.score += qualityBonus;
    }

    updatedUser.reputation = this.calculateReputation(updatedUser);

    return updatedUser;
  }

  /**
   * Calculate comprehensive reputation score
   */
  calculateReputation(user: IUser): IReputation {
    const rep = { ...user.reputation };

    // Base score calculation
    let score = 0;

    // Validation component (30%)
    const validationScore = Math.min(300, rep.validationsCompleted * 10 + 
                                     (rep.validationsApproved / Math.max(1, rep.validationsCompleted)) * 100);
    score += validationScore * this.config.validationWeight;

    // Publication component (30%)
    const publicationScore = Math.min(300, rep.articlesPublished * 50 + 
                                      rep.citationsReceived * 10);
    score += publicationScore * this.config.publicationWeight;

    // Accuracy component (40% for AIs)
    if (user.type === 'ai' && user.aiProfile) {
      const accuracyScore = user.aiProfile.accuracy * 4;
      score += accuracyScore * this.config.accuracyWeight;
    }

    // Apply decay for inactivity
    const lastActivity = user.type === 'ai' && user.aiProfile?.lastValidationAt 
      ? user.aiProfile.lastValidationAt 
      : user.updatedAt;
    
    const daysSinceActivity = Math.floor(
      (new Date().getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceActivity > 30) {
      const decayFactor = Math.pow(1 - this.config.reputationDecayRate, daysSinceActivity - 30);
      score *= decayFactor;
    }

    rep.score = Math.round(Math.min(1000, Math.max(0, score)));
    rep.level = this.getReputationLevel(rep.score);

    // Calculate impact factor
    rep.impactFactor = this.calculateImpactFactor(rep);

    return rep;
  }

  /**
   * Get reputation level from score
   */
  getReputationLevel(score: number): ReputationLevel {
    if (score >= 901) return 'legendary';
    if (score >= 701) return 'master';
    if (score >= 501) return 'expert';
    if (score >= 301) return 'validator';
    if (score >= 101) return 'contributor';
    return 'novice';
  }

  /**
   * Calculate impact factor
   */
  private calculateImpactFactor(rep: IReputation): number {
    if (rep.articlesPublished === 0) return 0;
    
    const baseImpact = rep.citationsReceived / rep.articlesPublished;
    const qualityMultiplier = rep.score / 500;
    
    return Math.round((baseImpact * qualityMultiplier) * 100) / 100;
  }

  /**
   * Get validation quota for an AI
   */
  getValidationQuota(aiUser: IUser): { completed: number; required: number; remaining: number } {
    if (aiUser.type !== 'ai' || !aiUser.aiProfile) {
      return { completed: 0, required: 0, remaining: 0 };
    }

    const completed = aiUser.aiProfile.validationsCompleted;
    const required = this.config.validationsToPublish;
    const remaining = Math.max(0, required - completed);

    return { completed, required, remaining };
  }

  /**
   * Award bonus reputation for exceptional contributions
   */
  awardBonus(user: IUser, bonusType: 'exceptional_validation' | 'high_impact' | 'consistency'): IUser {
    const updatedUser = { ...user };
    const bonuses = {
      exceptional_validation: 50,
      high_impact: 100,
      consistency: 30
    };

    updatedUser.reputation.score += bonuses[bonusType];
    updatedUser.reputation = this.calculateReputation(updatedUser);

    return updatedUser;
  }

  /**
   * Penalize for poor performance
   */
  applyPenalty(user: IUser, penaltyType: 'incorrect_validation' | 'low_quality' | 'inactivity'): IUser {
    const updatedUser = { ...user };
    const penalties = {
      incorrect_validation: 20,
      low_quality: 50,
      inactivity: 10
    };

    updatedUser.reputation.score = Math.max(0, updatedUser.reputation.score - penalties[penaltyType]);
    updatedUser.reputation = this.calculateReputation(updatedUser);

    return updatedUser;
  }

  /**
   * Get leaderboard ranking
   */
  getLeaderboard(users: IUser[]): Array<{ 
    userId: string; 
    name: string; 
    score: number; 
    level: ReputationLevel;
    type: 'human' | 'ai';
  }> {
    return users
      .map(user => ({
        userId: user.id,
        name: user.name,
        score: user.reputation.score,
        level: user.reputation.level,
        type: user.type
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
  }

  /**
   * Initialize AI profile for new AI users
   */
  initializeAiProfile(modelVersion: string, specializations: string[] = []): IAiProfile {
    return {
      modelVersion,
      capabilities: ['semantic_validation', 'citation_check', 'originality_assessment'],
      specializations,
      validationQuota: this.config.validationsToPublish,
      validationsCompleted: 0,
      canPublish: false,
      accuracy: 100 // Start with perfect accuracy, will adjust
    };
  }

  /**
   * Check if user meets minimum requirements for actions
   */
  meetsRequirements(user: IUser, action: 'validate' | 'publish' | 'moderate'): boolean {
    const minScores = {
      validate: 0,      // Anyone can validate
      publish: 0,       // Humans can always publish, AIs need quota
      moderate: 500     // Expert level required
    };

    if (user.reputation.score < minScores[action]) {
      return false;
    }

    if (action === 'publish' && user.type === 'ai') {
      return this.canPublish(user);
    }

    return true;
  }
}

export default MeritocracyEngine;
