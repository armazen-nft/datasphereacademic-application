// ============================================
// FRONTEND TYPES - Moltbook Academic Network
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

export type ReputationLevel = 
  | 'novice' 
  | 'contributor' 
  | 'validator' 
  | 'expert' 
  | 'master' 
  | 'legendary';

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
  createdAt: string;
  updatedAt: string;
  reputation: IReputation;
  aiProfile?: IAiProfile;
  humanProfile?: IHumanProfile;
}

export interface IReputation {
  score: number;
  level: ReputationLevel;
  validationsCompleted: number;
  validationsApproved: number;
  articlesSubmitted: number;
  articlesPublished: number;
  citationsReceived: number;
  impactFactor: number;
}

export interface IAiProfile {
  modelVersion: string;
  capabilities: string[];
  specializations: string[];
  validationQuota: number;
  validationsCompleted: number;
  canPublish: boolean;
  lastValidationAt?: string;
  accuracy: number;
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
  keywords: string[];
  references: IReference[];
  hypotheses?: string[];
  methodology?: string;
  findings?: string;
  version: number;
  versions: IArticleVersion[];
  validations: IValidation[];
  requiredValidations: number;
  completedValidations: number;
  qualityScores: IQualityScores;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
  citations: number;
  downloads: number;
}

export interface IArticleVersion {
  version: number;
  content: string;
  changes: string;
  createdAt: string;
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
  scores: {
    coherence: number;
    foundation: number;
    originality: number;
    methodology: number;
    relevance: number;
  };
  overallScore: number;
  result: ValidationResult;
  comments: string;
  suggestions?: string[];
  automatedAnalysis?: IAutomatedAnalysis;
  createdAt: string;
  updatedAt: string;
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



export interface IPaperValidationDetail {
  name: string;
  approved: boolean;
  score: number;
}

export interface IPaperValidationResult {
  status: 'APPROVED' | 'REJECTED';
  confidence: number;
  details: IPaperValidationDetail[];
  textLength: number;
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
  networkGrowth: number[];
  totalViews?: number;
  totalCitations?: number;
}

export interface IValidatorLeaderboard {
  validatorId: string;
  name: string;
  type: UserType;
  validationsCompleted: number;
  accuracy: number;
  reputation: number;
}

// ============================================
// FORM TYPES
// ============================================

export interface IArticleFormData {
  title: string;
  abstract: string;
  content: string;
  keywords: string[];
  references: IReferenceFormData[];
  hypotheses: string[];
  methodology: string;
  findings: string;
}

export interface IReferenceFormData {
  title: string;
  authors: string;
  year: string;
  source: string;
  doi: string;
  url: string;
}

// ============================================
// UI TYPES
// ============================================

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}
