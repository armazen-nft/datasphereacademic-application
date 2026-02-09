/**
 * ============================================
 * MAIN AI VALIDATOR - Integration Module
 * ============================================
 * 
 * Orchestrates all AI validation modules:
 * - Semantic validation
 * - Citation validation  
 * - Originality checking
 * - Meritocracy tracking
 */

import { SemanticValidator } from './SemanticValidator';
import { CitationValidator } from './CitationValidator';
import { OriginalityChecker } from './OriginalityChecker';
import { MeritocracyEngine } from './MeritocracyEngine';
import { 
  IArticle, 
  IValidation, 
  IQualityScores, 
  IAutomatedAnalysis,
  IUser 
} from '../../../shared/types';

export interface ValidationWeights {
  semantic: number;
  citation: number;
  originality: number;
}

export interface ValidationThresholds {
  minOverallScore: number;
  minSemanticScore: number;
  minCitationScore: number;
  minOriginalityScore: number;
}

export class AIValidator {
  private semanticValidator: SemanticValidator;
  private citationValidator: CitationValidator;
  private originalityChecker: OriginalityChecker;
  private meritocracyEngine: MeritocracyEngine;
  
  private weights: ValidationWeights;
  private thresholds: ValidationThresholds;

  constructor(
    weights: Partial<ValidationWeights> = {},
    thresholds: Partial<ValidationThresholds> = {}
  ) {
    this.semanticValidator = new SemanticValidator();
    this.citationValidator = new CitationValidator();
    this.originalityChecker = new OriginalityChecker();
    this.meritocracyEngine = new MeritocracyEngine();
    
    this.weights = {
      semantic: 0.35,
      citation: 0.30,
      originality: 0.35,
      ...weights
    };
    
    this.thresholds = {
      minOverallScore: 70,
      minSemanticScore: 60,
      minCitationScore: 50,
      minOriginalityScore: 60,
      ...thresholds
    };
  }

  /**
   * Perform complete validation of an article
   */
  async validateArticle(
    article: IArticle,
    validatorUser: IUser,
    existingArticles: string[] = []
  ): Promise<IValidation> {
    // Run all validation modules in parallel
    const [semanticResult, citationResult, originalityResult] = await Promise.all([
      this.semanticValidator.validate(article.content, article.title, article.abstract),
      this.citationValidator.validate(article.content, article.references),
      this.originalityChecker.validate(article.content, article.title, existingArticles)
    ]);

    // Calculate individual scores
    const semanticScore = this.calculateSemanticScore(semanticResult);
    const citationScore = this.calculateCitationScore(citationResult);
    const originalityScore = this.calculateOriginalityScore(originalityResult);

    // Calculate weighted overall score
    const overallScore = Math.round(
      semanticScore * this.weights.semantic +
      citationScore * this.weights.citation +
      originalityScore * this.weights.originality
    );

    // Determine result
    const result = this.determineResult(
      overallScore,
      semanticScore,
      citationScore,
      originalityScore
    );

    // Build automated analysis
    const automatedAnalysis: IAutomatedAnalysis = {
      semanticCoherence: semanticResult.coherence,
      logicalConsistency: semanticResult.logicalConsistency,
      citationQuality: citationResult.consistencyScore,
      fallacyDetection: semanticResult.fallacies,
      plagiarismRisk: originalityResult.similarityRisk * 100,
      academicDepth: this.calculateAcademicDepth(article)
    };

    // Generate comments
    const comments = this.generateValidationComments(
      semanticResult,
      citationResult,
      originalityResult,
      result
    );

    // Build validation object
    const validation: IValidation = {
      id: this.generateId(),
      articleId: article.id,
      validatorId: validatorUser.id,
      validatorType: validatorUser.type,
      scores: {
        coherence: semanticScore,
        foundation: citationScore,
        originality: originalityScore,
        methodology: this.calculateMethodologyScore(article),
        relevance: this.calculateRelevanceScore(article)
      },
      overallScore,
      result,
      comments,
      suggestions: [
        ...semanticResult.suggestions,
        ...citationResult.suggestions
      ],
      automatedAnalysis,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return validation;
  }

  /**
   * Batch validation for multiple AI validators (P2P consensus)
   */
  async performConsensusValidation(
    article: IArticle,
    validators: IUser[],
    existingArticles: string[] = []
  ): Promise<{
    validations: IValidation[];
    consensus: 'approved' | 'rejected' | 'undecided';
    averageScore: number;
    confidence: number;
  }> {
    const validations: IValidation[] = [];

    for (const validator of validators) {
      const validation = await this.validateArticle(article, validator, existingArticles);
      validations.push(validation);
    }

    // Calculate consensus
    const approvedCount = validations.filter(v => v.result === 'approved').length;
    const rejectedCount = validations.filter(v => v.result === 'rejected').length;
    
    let consensus: 'approved' | 'rejected' | 'undecided';
    if (approvedCount > rejectedCount * 1.5) {
      consensus = 'approved';
    } else if (rejectedCount > approvedCount * 1.5) {
      consensus = 'rejected';
    } else {
      consensus = 'undecided';
    }

    // Calculate average score
    const averageScore = Math.round(
      validations.reduce((sum, v) => sum + v.overallScore, 0) / validations.length
    );

    // Calculate confidence
    const agreement = Math.max(approvedCount, rejectedCount) / validations.length;
    const scoreVariance = this.calculateVariance(validations.map(v => v.overallScore));
    const confidence = Math.round((agreement * 0.6 + (1 - scoreVariance / 100) * 0.4) * 100);

    return {
      validations,
      consensus,
      averageScore,
      confidence
    };
  }

  /**
   * Quick pre-filter check for minimum requirements
   */
  async preFilterCheck(article: IArticle): Promise<{
    passed: boolean;
    issues: string[];
    scores: Partial<IQualityScores>;
  }> {
    const issues: string[] = [];
    
    // Check minimum content length
    if (article.content.length < 1000) {
      issues.push('Conteúdo muito curto para um artigo acadêmico');
    }

    // Check abstract
    if (!article.abstract || article.abstract.length < 100) {
      issues.push('Resumo muito curto ou ausente');
    }

    // Check references
    if (article.references.length < 5) {
      issues.push('Número insuficiente de referências');
    }

    // Check keywords
    if (!article.keywords || article.keywords.length < 3) {
      issues.push('Palavras-chave insuficientes');
    }

    // Quick semantic check
    const semanticResult = await this.semanticValidator.validate(
      article.content, 
      article.title, 
      article.abstract
    );

    if (semanticResult.coherence < 40) {
      issues.push('Baixa coerência semântica detectada');
    }

    if (semanticResult.fallacies.length > 3) {
      issues.push('Múltiplas falácias lógicas detectadas');
    }

    // Quick citation check
    const citationResult = await this.citationValidator.validate(
      article.content,
      article.references
    );

    if (citationResult.validReferences < article.references.length * 0.5) {
      issues.push('Muitas referências inválidas ou não verificáveis');
    }

    const passed = issues.length === 0;

    return {
      passed,
      issues,
      scores: {
        semantic: Math.round(semanticResult.coherence),
        logical: Math.round(semanticResult.logicalConsistency),
        citations: Math.round(citationResult.consistencyScore)
      }
    };
  }

  /**
   * Calculate quality scores for an article
   */
  calculateQualityScores(article: IArticle): IQualityScores {
    if (!article.validations || article.validations.length === 0) {
      return {
        semantic: 0,
        logical: 0,
        citations: 0,
        originality: 0,
        depth: 0,
        overall: 0
      };
    }

    const validations = article.validations;
    
    const avg = (key: keyof IValidation['scores']) => 
      Math.round(validations.reduce((sum, v) => sum + v.scores[key], 0) / validations.length);

    const semantic = avg('coherence');
    const logical = Math.round(
      validations.reduce((sum, v) => sum + (v.automatedAnalysis?.logicalConsistency || 0), 0) / validations.length
    );
    const citations = avg('foundation');
    const originality = avg('originality');
    const depth = Math.round(
      validations.reduce((sum, v) => sum + (v.automatedAnalysis?.academicDepth || 0), 0) / validations.length
    );

    return {
      semantic,
      logical,
      citations,
      originality,
      depth,
      overall: Math.round((semantic + logical + citations + originality + depth) / 5)
    };
  }

  // Private helper methods
  private calculateSemanticScore(result: Awaited<ReturnType<SemanticValidator['validate']>>): number {
    let score = result.coherence * 0.4 + result.logicalConsistency * 0.4;
    
    // Penalize for fallacies
    score -= result.fallacies.length * 5;
    
    // Penalize for meaningless propositions
    score -= result.meaninglessPropositions.length * 3;
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateCitationScore(result: Awaited<ReturnType<CitationValidator['validate']>>): number {
    const totalRefs = result.validReferences + result.invalidReferences + result.unverifiedReferences;
    if (totalRefs === 0) return 0;
    
    const validRatio = result.validReferences / totalRefs;
    return Math.round((validRatio * 50 + result.consistencyScore * 0.5));
  }

  private calculateOriginalityScore(result: Awaited<ReturnType<OriginalityChecker['validate']>>): number {
    let score = result.originalityScore;
    
    // Penalize for high similarity risk
    score -= result.similarityRisk * 30;
    
    // Penalize for trivial content
    if (result.trivialContent) {
      score -= 30;
    }
    
    // Bonus for novel contributions
    score += result.novelContributions.length * 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateMethodologyScore(article: IArticle): number {
    let score = 50; // Base score
    
    if (article.methodology) score += 20;
    if (article.hypotheses && article.hypotheses.length > 0) score += 15;
    if (article.findings) score += 15;
    
    return Math.min(100, score);
  }

  private calculateRelevanceScore(article: IArticle): number {
    let score = 50;
    
    // Check keywords relevance
    if (article.keywords.length >= 5) score += 10;
    
    // Check abstract clarity
    if (article.abstract.length > 200) score += 10;
    
    // Check citations integration
    const citationMentions = (article.content.match(/\([A-Z][a-z]+,\s*\d{4}\)/g) || []).length;
    score += Math.min(30, citationMentions * 2);
    
    return Math.min(100, score);
  }

  private calculateAcademicDepth(article: IArticle): number {
    let depth = 0;
    
    // Check for academic sections
    const hasIntroduction = /\b(introdução|introduzimos)\b/gi.test(article.content);
    const hasMethodology = /\b(metodologia|método|procedimento)\b/gi.test(article.content);
    const hasResults = /\b(resultados|achados|encontramos)\b/gi.test(article.content);
    const hasDiscussion = /\b(discussão|discutimos|analisamos)\b/gi.test(article.content);
    const hasConclusion = /\b(conclusão|concluímos)\b/gi.test(article.content);
    
    depth += hasIntroduction ? 20 : 0;
    depth += hasMethodology ? 20 : 0;
    depth += hasResults ? 20 : 0;
    depth += hasDiscussion ? 20 : 0;
    depth += hasConclusion ? 20 : 0;
    
    return depth;
  }

  private determineResult(
    overallScore: number,
    semanticScore: number,
    citationScore: number,
    originalityScore: number
  ): 'approved' | 'rejected' | 'pending' {
    if (overallScore >= this.thresholds.minOverallScore &&
        semanticScore >= this.thresholds.minSemanticScore &&
        citationScore >= this.thresholds.minCitationScore &&
        originalityScore >= this.thresholds.minOriginalityScore) {
      return 'approved';
    }
    
    if (overallScore < 40 || semanticScore < 30 || originalityScore < 30) {
      return 'rejected';
    }
    
    return 'pending';
  }

  private generateValidationComments(
    semantic: Awaited<ReturnType<SemanticValidator['validate']>>,
    citation: Awaited<ReturnType<CitationValidator['validate']>>,
    originality: Awaited<ReturnType<OriginalityChecker['validate']>>,
    result: string
  ): string {
    const comments: string[] = [];
    
    // Semantic comments
    comments.push(`Coerência semântica: ${semantic.coherence.toFixed(1)}/100`);
    comments.push(`Consistência lógica: ${semantic.logicalConsistency.toFixed(1)}/100`);
    
    if (semantic.fallacies.length > 0) {
      comments.push(`Falácias detectadas: ${semantic.fallacies.join(', ')}`);
    }
    
    // Citation comments
    comments.push(`Qualidade de citações: ${citation.consistencyScore.toFixed(1)}/100`);
    comments.push(`Referências válidas: ${citation.validReferences}/${citation.validReferences + citation.invalidReferences + citation.unverifiedReferences}`);
    
    // Originality comments
    comments.push(`Originalidade: ${originality.originalityScore.toFixed(1)}/100`);
    
    if (originality.trivialContent) {
      comments.push('Conteúdo trivial detectado - necessita aprofundamento');
    }
    
    if (originality.novelContributions.length > 0) {
      comments.push(`Contribuições identificadas: ${originality.novelContributions.length}`);
    }
    
    // Result
    comments.push(`Resultado: ${result.toUpperCase()}`);
    
    return comments.join('. ');
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b) / values.length;
  }

  private generateId(): string {
    return `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default AIValidator;
