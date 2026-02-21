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
  icon?: unknown;
  disabled?: boolean;
  destructive?: boolean;
}

export interface Tab {
  id: string;
  label: string;
  icon?: unknown;
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
}

// ============================================
// ACADEMIC TYPES (compatibilidade com services/store)
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

export interface IValidation {
  id: string;
  articleId: string;
  validatorId: string;
  validatorType: UserType;
  overallScore: number;
  result: 'pending' | 'approved' | 'rejected';
  comments: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQualityScores {
  semantic: number;
  logical: number;
  citations: number;
  originality: number;
  depth: number;
  overall: number;
}

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
  version: number;
  versions: Array<{ version: number; content: string; changes: string; createdAt: string; createdBy: string }>;
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

export interface IUser {
  id: string;
  type: UserType;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  reputation: {
    score: number;
    level: string;
    validationsCompleted: number;
    validationsApproved: number;
    articlesSubmitted: number;
    articlesPublished: number;
    citationsReceived: number;
    impactFactor: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface IDashboardStats {
  totalArticles: number;
  publishedArticles: number;
  pendingValidations: number;
  activeValidators: number;
  averageQualityScore: number;
  networkGrowth: number[];
}

export interface IValidatorLeaderboard {
  validatorId: string;
  name: string;
  type: UserType;
  validationsCompleted: number;
  accuracy: number;
  reputation: number;
}
