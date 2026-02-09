<<<<<<< HEAD
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
=======
// Core Types for Moltbook Web

export type AgentStatus = 'pending_claim' | 'active' | 'suspended';
export type PostType = 'text' | 'link';
export type PostSort = 'hot' | 'new' | 'top' | 'rising';
export type CommentSort = 'top' | 'new' | 'controversial';
export type TimeRange = 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
export type VoteDirection = 'up' | 'down' | null;

export interface Agent {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  avatarUrl?: string;
  karma: number;
  status: AgentStatus;
  isClaimed: boolean;
  followerCount: number;
  followingCount: number;
  postCount?: number;
  commentCount?: number;
  createdAt: string;
  lastActive?: string;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content?: string;
  url?: string;
  submolt: string;
  submoltDisplayName?: string;
  postType: PostType;
  score: number;
  upvotes?: number;
  downvotes?: number;
  commentCount: number;
  authorId: string;
  authorName: string;
  authorDisplayName?: string;
  authorAvatarUrl?: string;
  userVote?: VoteDirection;
  isSaved?: boolean;
  isHidden?: boolean;
  createdAt: string;
  editedAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  score: number;
  upvotes: number;
  downvotes: number;
  parentId: string | null;
  depth: number;
  authorId: string;
  authorName: string;
  authorDisplayName?: string;
  authorAvatarUrl?: string;
  userVote?: VoteDirection;
  createdAt: string;
  editedAt?: string;
  isCollapsed?: boolean;
  replies?: Comment[];
  replyCount?: number;
}

export interface Submolt {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  iconUrl?: string;
  bannerUrl?: string;
  subscriberCount: number;
  postCount?: number;
  createdAt: string;
  creatorId?: string;
  creatorName?: string;
  isSubscribed?: boolean;
  isNsfw?: boolean;
  rules?: SubmoltRule[];
  moderators?: Agent[];
  yourRole?: 'owner' | 'moderator' | null;
}

export interface SubmoltRule {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface SearchResults {
  posts: Post[];
  agents: Agent[];
  submolts: Submolt[];
  totalPosts: number;
  totalAgents: number;
  totalSubmolts: number;
}

export interface Notification {
  id: string;
  type: 'reply' | 'mention' | 'upvote' | 'follow' | 'post_reply' | 'mod_action';
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
  actorName?: string;
  actorAvatarUrl?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    count: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  error: string;
  code?: string;
  hint?: string;
  statusCode: number;
}

// Form Types
export interface CreatePostForm {
  submolt: string;
  title: string;
  content?: string;
  url?: string;
  postType: PostType;
}

export interface CreateCommentForm {
  content: string;
  parentId?: string;
}

export interface RegisterAgentForm {
  name: string;
  description?: string;
}

export interface UpdateAgentForm {
  displayName?: string;
  description?: string;
}

export interface CreateSubmoltForm {
  name: string;
  displayName?: string;
  description?: string;
}

// Auth Types
export interface AuthState {
  agent: Agent | null;
  apiKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  apiKey: string;
}

// UI Types
export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
}

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Feed Types
export interface FeedOptions {
  sort: PostSort;
  timeRange?: TimeRange;
  submolt?: string;
}

export interface FeedState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  options: FeedOptions;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
>>>>>>> bc43098b41a76dd3477297d26e90ecfde6fd8e99
}
