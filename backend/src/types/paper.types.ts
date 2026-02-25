export interface PaperDTO {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  status: 'pending' | 'validated' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaperDTO {
  title: string;
  abstract: string;
  authors: string[];
}

export interface AIValidationDetail {
  aiName: string;
  score: number;
  approved: boolean;
  reasoning: string;
}

export interface ValidationResult {
  status: 'APPROVED' | 'REJECTED' | 'REVIEW_NEEDED';
  confidence: number;
  details: AIValidationDetail[];
}
