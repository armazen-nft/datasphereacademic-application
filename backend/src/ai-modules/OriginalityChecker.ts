/**
 * ============================================
 * ORIGINALITY CHECKING MODULE
 * ============================================
 * 
 * Validates:
 * - Originalidade do conteúdo
 * - Detecção de plágio
 * - Identificação de ideias triviais
 */

import { IOriginalityResult } from '../../../shared/types';

export class OriginalityChecker {
  
  // Common phrases that indicate unoriginal content
  private clichéPhrases = [
    'desde o início dos tempos',
    'ao longo da história',
    'na sociedade moderna',
    'com o avanço da tecnologia',
    'no mundo atual',
    'é sabido que',
    'é consenso que',
    'estudos mostram que',
    'pesquisas indicam que',
    'não é novidade que',
    'como todos sabem',
    'é fato que',
    'evidentemente',
    'obviamente',
    'sem dúvida'
  ];

  // Indicators of trivial content
  private trivialIndicators = [
    'importante',
    'significativo',
    'relevante',
    'interessante',
    'notável',
    'fundamental',
    'essencial',
    'crucial',
    'vital',
    'necessário'
  ];

  // Common knowledge statements
  private commonKnowledge = [
    /\b(a água ferve a 100 graus|o sol nasce no leste|a terra é redonda|o céu é azul)\b/gi,
    /\b(oxigênio é essencial para a vida|humanos precisam de água|o ser humano é um animal social)\b/gi,
    /\b(a educação é importante|a saúde é fundamental|o conhecimento é poder)\b/gi
  ];

  /**
   * Main validation method
   */
  async validate(content: string, title: string, existingArticles: string[] = []): Promise<IOriginalityResult> {
    const originalityScore = await this.calculateOriginality(content, existingArticles);
    const similarityRisk = this.assessSimilarityRisk(content, existingArticles);
    const trivialContent = this.detectTrivialContent(content);
    const novelContributions = this.identifyNovelContributions(content, title);

    return {
      originalityScore,
      similarityRisk,
      trivialContent,
      novelContributions
    };
  }

  /**
   * Calculate originality score
   */
  private async calculateOriginality(content: string, existingArticles: string[]): Promise<number> {
    let score = 100;
    
    // Check for clichés
    const clichéCount = this.countClichés(content);
    score -= clichéCount * 2;
    
    // Check for common knowledge statements
    const commonKnowledgeCount = this.countCommonKnowledge(content);
    score -= commonKnowledgeCount * 5;
    
    // Check similarity with existing articles
    if (existingArticles.length > 0) {
      const maxSimilarity = this.calculateMaxSimilarity(content, existingArticles);
      score -= maxSimilarity * 30;
    }
    
    // Check for generic statements
    const genericScore = this.assessGenericContent(content);
    score *= genericScore;
    
    // Check for unique terminology
    const uniquenessScore = this.assessTerminologicalUniqueness(content);
    score *= uniquenessScore;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Assess similarity risk with existing content
   */
  private assessSimilarityRisk(content: string, existingArticles: string[]): number {
    if (existingArticles.length === 0) return 0;
    
    const similarities: number[] = [];
    
    for (const existing of existingArticles) {
      const similarity = this.calculateTextSimilarity(content, existing);
      similarities.push(similarity);
    }
    
    const maxSimilarity = Math.max(...similarities);
    
    // Risk levels
    if (maxSimilarity > 0.7) return 1.0;      // High risk
    if (maxSimilarity > 0.5) return 0.7;      // Medium-high risk
    if (maxSimilarity > 0.3) return 0.4;      // Medium risk
    if (maxSimilarity > 0.15) return 0.2;     // Low risk
    return 0;                                  // No risk
  }

  /**
   * Detect if content is trivial
   */
  private detectTrivialContent(content: string): boolean {
    const sentences = this.splitIntoSentences(content);
    let trivialCount = 0;
    
    for (const sentence of sentences) {
      // Check for vague superlatives without evidence
      if (this.hasVagueSuperlatives(sentence)) {
        trivialCount++;
      }
      
      // Check for obvious statements
      if (this.isObviousStatement(sentence)) {
        trivialCount++;
      }
      
      // Check for circular definitions
      if (this.isCircularDefinition(sentence)) {
        trivialCount++;
      }
    }
    
    const trivialRatio = trivialCount / sentences.length;
    return trivialRatio > 0.3; // More than 30% trivial content
  }

  /**
   * Identify novel contributions in the content
   */
  private identifyNovelContributions(content: string, title: string): string[] {
    const contributions: string[] = [];
    const sentences = this.splitIntoSentences(content);
    
    // Look for innovation indicators
    const innovationPatterns = [
      /\b(propomos|proponho|propomos aqui|este trabalho propõe)\b/gi,
      /\b(contribuímos com|nossa contribuição|contribuição principal)\b/gi,
      /\b(novo modelo|nova abordagem|nova metodologia|nova técnica)\b/gi,
      /\b(pela primeira vez|inédito|original|inovador)\b/gi,
      /\b(diferentemente de|ao contrário de|em contraste com)\b/gi,
      /\b(resolvemos|solucionamos|abordamos|tratamos)\b/gi
    ];
    
    for (const sentence of sentences) {
      for (const pattern of innovationPatterns) {
        if (pattern.test(sentence)) {
          const contribution = this.extractContribution(sentence);
          if (contribution && contribution.length > 20) {
            contributions.push(contribution);
          }
          break;
        }
      }
    }
    
    // Extract from title if it contains novelty indicators
    const titleNoveltyPatterns = [
      /\b(um novo|uma nova|novo|nova|inovador|inovadora)\b/gi,
      /\b(abordagem|modelo|framework|método|técnica|algoritmo)\b/gi
    ];
    
    const hasTitleNovelty = titleNoveltyPatterns.some(p => p.test(title));
    if (hasTitleNovelty && !contributions.some(c => c.includes(title))) {
      contributions.push(`Contribuição indicada no título: "${title}"`);
    }
    
    return [...new Set(contributions)].slice(0, 5);
  }

  // Helper methods
  private countClichés(content: string): number {
    let count = 0;
    for (const cliché of this.clichéPhrases) {
      const regex = new RegExp(`\\b${cliché}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) count += matches.length;
    }
    return count;
  }

  private countCommonKnowledge(content: string): number {
    let count = 0;
    for (const pattern of this.commonKnowledge) {
      const matches = content.match(pattern);
      if (matches) count += matches.length;
    }
    return count;
  }

  private calculateMaxSimilarity(content: string, existingArticles: string[]): number {
    const similarities = existingArticles.map(existing => 
      this.calculateTextSimilarity(content, existing)
    );
    return Math.max(...similarities);
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    // Normalize texts
    const normalize = (text: string) => 
      text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    
    const norm1 = normalize(text1);
    const norm2 = normalize(text2);
    
    // Extract n-grams (3-grams)
    const getNGrams = (text: string, n: number): string[] => {
      const words = text.split(' ');
      const ngrams: string[] = [];
      for (let i = 0; i <= words.length - n; i++) {
        ngrams.push(words.slice(i, i + n).join(' '));
      }
      return ngrams;
    };
    
    const ngrams1 = getNGrams(norm1, 3);
    const ngrams2 = getNGrams(norm2, 3);
    
    if (ngrams1.length === 0 || ngrams2.length === 0) return 0;
    
    // Calculate Jaccard similarity
    const set1 = new Set(ngrams1);
    const set2 = new Set(ngrams2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  private assessGenericContent(content: string): number {
    const sentences = this.splitIntoSentences(content);
    let genericCount = 0;
    
    for (const sentence of sentences) {
      // Check for sentences that could apply to any topic
      const words = sentence.toLowerCase().split(/\s+/);
      const genericWords = ['coisa', 'aspecto', 'fator', 'elemento', 'componente', 'parte'];
      const genericWordCount = words.filter(w => genericWords.some(gw => w.includes(gw))).length;
      
      if (genericWordCount > 2) {
        genericCount++;
      }
    }
    
    const genericRatio = genericCount / sentences.length;
    return Math.max(0.5, 1 - genericRatio);
  }

  private assessTerminologicalUniqueness(content: string): number {
    const words = content.toLowerCase().match(/\b\w{5,}\b/g) || [];
    const uniqueWords = new Set(words);
    
    if (words.length === 0) return 0;
    
    const uniquenessRatio = uniqueWords.size / words.length;
    return Math.min(1, uniquenessRatio * 2); // Scale up a bit
  }

  private splitIntoSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  }

  private hasVagueSuperlatives(sentence: string): boolean {
    const superlatives = ['muito', 'extremamente', 'altamente', 'profundamente', 'grandemente'];
    const hasSuperlative = superlatives.some(s => sentence.toLowerCase().includes(s));
    const hasTrivialIndicator = this.trivialIndicators.some(ti => 
      sentence.toLowerCase().includes(ti)
    );
    
    return hasSuperlative && hasTrivialIndicator && !sentence.includes('porque') && !sentence.includes('pois');
  }

  private isObviousStatement(sentence: string): boolean {
    const obviousPatterns = [
      /\b(é importante notar|vale ressaltar|é necessário mencionar)\b/gi,
      /\b(não podemos ignorar|não devemos esquecer|é fundamental lembrar)\b/gi
    ];
    
    return obviousPatterns.some(p => p.test(sentence));
  }

  private isCircularDefinition(sentence: string): boolean {
    const words = sentence.toLowerCase().split(/\s+/);
    if (words.length < 5) return false;
    
    // Check if sentence defines something using itself
    const isPattern = /\b(é|são)\s+uma?\s+\w+\s+que\s+é/gi;
    return isPattern.test(sentence);
  }

  private extractContribution(sentence: string): string {
    // Clean up and extract the contribution statement
    return sentence
      .replace(/\b(propomos|proponho|este trabalho propõe|nossa contribuição)\b/gi, '')
      .replace(/^\s*[,;:]\s*/, '')
      .trim();
  }
}

export default OriginalityChecker;
