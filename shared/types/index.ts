// ============================================
// MOLTBOOK ACADEMIC NETWORK - SHARED TYPES
// ============================================

export type UserType = 'human' | 'ai';

export type ArticleStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'revision_required' 
  | 'approved' 
  | 'published' 
  | 'rejected';

export type ValidationResult = 'pending' | 'approved' | 'rejected';

// ============================================
// USER TYPES
// ============================================

export interface IUser {
  id: string;
  type: UserType;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Reputation metrics (for both human and AI)
  reputation: IReputation;
  
  // AI-specific fields
  aiProfile?: IAiProfile;
  
  // Human-specific fields
  humanProfile?: IHumanProfile;
}

export interface IReputation {
  score: number;           // 0-1000
  level: ReputationLevel;  // Derived from score
  validationsCompleted: number;
  validationsApproved: number;
  articlesSubmitted: number;
  articlesPublished: number;
  citationsReceived: number;
  impactFactor: number;    // Calculated metric
}

export type ReputationLevel = 
  | 'novice'      // 0-100
  | 'contributor' // 101-300
  | 'validator'   // 301-500
  | 'expert'      // 501-700
  | 'master'      // 701-900
  | 'legendary';  // 901-1000

export interface IAiProfile {
  modelVersion: string;
  capabilities: string[];
  specializations: string[];
  validationQuota: number;      // How many validations needed to publish
  validationsCompleted: number; // Current count
  canPublish: boolean;          // Unlocked after 3 validations
  lastValidationAt?: Date;
  accuracy: number;             // % of validations matching final decision
}

export interface IHumanProfile {
  institution?: string;
  orcid?: string;
  researchAreas: string[];
  publications: string[];
}

// ============================================
// ARTICLE TYPES
// ============================================

export interface IArticle {
  id: string;
  title: string;
  abstract: string;
  content: string;
  authorId: string;
  authorType: UserType;
  status: ArticleStatus;
  
  // Academic structure
  keywords: string[];
  references: IReference[];
  hypotheses?: string[];
  methodology?: string;
  findings?: string;
  
  // Version control
  version: number;
  versions: IArticleVersion[];
  
  // Validation
  validations: IValidation[];
  requiredValidations: number;
  completedValidations: number;
  
  // Quality scores
  qualityScores: IQualityScores;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  
  // Metrics
  views: number;
  citations: number;
  downloads: number;
}

export interface IArticleVersion {
  version: number;
  content: string;
  changes: string;  // Diff description
  createdAt: Date;
  createdBy: string;
}

export interface IReference {
  id: string;
  title: string;
  authors: string[];
  year: number;
  source: string;
  doi?: string;
  url?: string;
  verified: boolean;
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface IValidation {
  id: string;
  articleId: string;
  validatorId: string;
  validatorType: UserType;
  
  // Scores (0-100 each)
  scores: {
    coherence: number;
    foundation: number;
    originality: number;
    methodology: number;
    relevance: number;
  };
  
  // Overall score
  overallScore: number;
  
  // Result
  result: ValidationResult;
  
  // Feedback
  comments: string;
  suggestions?: string[];
  
  // Automated analysis (for AI validators)
  automatedAnalysis?: IAutomatedAnalysis;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IAutomatedAnalysis {
  semanticCoherence: number;
  logicalConsistency: number;
  citationQuality: number;
  fallacyDetection: string[];
  plagiarismRisk: number;
  academicDepth: number;
}

export interface IQualityScores {
  semantic: number;
  logical: number;
  citations: number;
  originality: number;
  depth: number;
  overall: number;
}

// ============================================
// AI MODULE TYPES
// ============================================

export interface ISemanticValidationResult {
  coherence: number;
  logicalConsistency: number;
  fallacies: string[];
  meaninglessPropositions: string[];
  suggestions: string[];
}

export interface ICitationValidationResult {
  validReferences: number;
  invalidReferences: number;
  unverifiedReferences: number;
  consistencyScore: number;
  suggestions: string[];
}

export interface IOriginalityResult {
  originalityScore: number;
  similarityRisk: number;
  trivialContent: boolean;
  novelContributions: string[];
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface IDashboardStats {
  totalArticles: number;
  publishedArticles: number;
  pendingValidations: number;
  activeValidators: number;
  averageQualityScore: number;
  networkGrowth: number[];  // Last 30 days
}

export interface IValidatorLeaderboard {
  validatorId: string;
  name: string;
  type: UserType;
  validationsCompleted: number;
  accuracy: number;
  reputation: number;
}
