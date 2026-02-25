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
