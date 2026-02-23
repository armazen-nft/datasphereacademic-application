/**
 * ============================================
 * CITATION VALIDATION MODULE
 * ============================================
 * 
 * Validates:
 * - Verificação de referências
 * - Consistência com dados e teorias existentes
 * - Qualidade das fontes citadas
 */

import { ICitationValidationResult, IReference } from '../../../shared/types';

export class CitationValidator {
  
  // Trusted academic sources
  private trustedDomains = [
    'doi.org',
    'ncbi.nlm.nih.gov',
    'pubmed.ncbi.nlm.nih.gov',
    'scholar.google.com',
    'arxiv.org',
    'jstor.org',
    'sciencedirect.com',
    'springer.com',
    'wiley.com',
    'ieee.org',
    'acm.org',
    'nature.com',
    'science.org',
    'cell.com',
    'plos.org',
    'biorxiv.org',
    'medrxiv.org',
    'ssrn.com',
    'researchgate.net',
    'academia.edu'
  ];

  // Academic publishers
  private academicPublishers = [
    'Elsevier',
    'Springer',
    'Wiley',
    'IEEE',
    'ACM',
    'Nature Publishing',
    'Science',
    'Oxford University Press',
    'Cambridge University Press',
    'Taylor & Francis',
    'SAGE',
    'MDPI',
    'Frontiers'
  ];

  // Minimum references required by article type
  private minReferences = {
    research: 10,
    review: 30,
    commentary: 5,
    case_study: 8,
    theoretical: 15
  };

  /**
   * Main validation method
   */
  async validate(content: string, references: IReference[]): Promise<ICitationValidationResult> {
    const validReferences = this.countValidReferences(references);
    const invalidReferences = this.countInvalidReferences(references);
    const unverifiedReferences = references.length - validReferences - invalidReferences;
    const consistencyScore = await this.checkCitationConsistency(content, references);
    const suggestions = this.generateSuggestions(references, content);

    return {
      validReferences,
      invalidReferences,
      unverifiedReferences,
      consistencyScore,
      suggestions
    };
  }

  /**
   * Validate a single reference
   */
  validateReference(reference: IReference): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check required fields
    if (!reference.title || reference.title.trim().length < 5) {
      issues.push('Título muito curto ou ausente');
    }

    if (!reference.authors || reference.authors.length === 0) {
      issues.push('Autores não especificados');
    }

    if (!reference.year || reference.year < 1900 || reference.year > new Date().getFullYear()) {
      issues.push('Ano inválido');
    }

    if (!reference.source || reference.source.trim().length < 3) {
      issues.push('Fonte não especificada');
    }

    // Check if DOI or URL is provided
    if (!reference.doi && !reference.url) {
      issues.push('DOI ou URL não fornecido');
    }

    // Validate URL if provided
    if (reference.url) {
      const urlValidation = this.validateUrl(reference.url);
      if (!urlValidation.valid) {
        issues.push(...urlValidation.issues);
      }
    }

    // Validate DOI if provided
    if (reference.doi) {
      const doiValidation = this.validateDoi(reference.doi);
      if (!doiValidation.valid) {
        issues.push(...doiValidation.issues);
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Check if citations in content match references
   */
  async checkCitationConsistency(content: string, references: IReference[]): Promise<number> {
    let consistencyScore = 100;
    
    // Extract citation patterns from content
    const citationPatterns = this.extractCitations(content);
    
    // Check if cited references exist in reference list
    const unmatchedCitations = citationPatterns.filter(citation => 
      !this.findMatchingReference(citation, references)
    );
    
    if (unmatchedCitations.length > 0) {
      consistencyScore -= unmatchedCitations.length * 10;
    }
    
    // Check if all references are cited
    const uncitedReferences = references.filter(ref => 
      !this.isReferenceCited(ref, content)
    );
    
    if (uncitedReferences.length > 0) {
      consistencyScore -= uncitedReferences.length * 5;
    }
    
    // Check citation format consistency
    const formatConsistency = this.checkCitationFormatConsistency(content);
    consistencyScore *= formatConsistency;
    
    // Check source quality
    const sourceQuality = this.assessSourceQuality(references);
    consistencyScore *= sourceQuality;
    
    return Math.max(0, Math.min(100, consistencyScore));
  }

  /**
   * Extract citations from content
   */
  private extractCitations(content: string): Array<{ author: string; year: number }> {
    const citations: Array<{ author: string; year: number }> = [];
    
    // Author-Year format: (Smith, 2020) or Smith (2020)
    const authorYearPattern = /\(([A-Z][a-z]+(?:\s+et\s+al\.)?),?\s*(\d{4})[a-z]?\)/g;
    let match;
    while ((match = authorYearPattern.exec(content)) !== null) {
      citations.push({
        author: match[1],
        year: parseInt(match[2])
      });
    }
    
    // Numbered format: [1], [2,3], [1-5]
    const numberedPattern = /\[(\d+(?:\s*[-,]\s*\d+)*)\]/g;
    while ((match = numberedPattern.exec(content)) !== null) {
      const numbers = match[1].split(/[-,]/).map(n => parseInt(n.trim()));
      for (const num of numbers) {
        citations.push({ author: `[${num}]`, year: 0 });
      }
    }
    
    return citations;
  }

  /**
   * Find matching reference for a citation
   */
  private findMatchingReference(
    citation: { author: string; year: number }, 
    references: IReference[]
  ): boolean {
    return references.some(ref => {
      const authorMatch = ref.authors.some(author => 
        author.toLowerCase().includes(citation.author.toLowerCase()) ||
        citation.author.toLowerCase().includes(author.split(' ').pop()?.toLowerCase() || '')
      );
      const yearMatch = ref.year === citation.year || citation.year === 0;
      return authorMatch && yearMatch;
    });
  }

  /**
   * Check if a reference is cited in content
   */
  private isReferenceCited(reference: IReference, content: string): boolean {
    // Check by author
    const authorCited = reference.authors.some(author => 
      content.toLowerCase().includes(author.toLowerCase())
    );
    
    // Check by year
    const yearCited = content.includes(reference.year.toString());
    
    // Check by title keywords
    const titleWords = reference.title.split(' ').filter(w => w.length > 4);
    const titleCited = titleWords.some(word => 
      content.toLowerCase().includes(word.toLowerCase())
    );
    
    return authorCited || (authorCited && yearCited) || titleCited;
  }

  /**
   * Validate URL
   */
  private validateUrl(url: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    try {
      const urlObj = new URL(url);
      
      // Check protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        issues.push('Protocolo URL inválido');
      }
      
      // Check if domain is trusted
      const isTrusted = this.trustedDomains.some(domain => 
        urlObj.hostname.includes(domain)
      );
      
      if (!isTrusted) {
        issues.push('Domínio não reconhecido como fonte acadêmica confiável');
      }
      
    } catch {
      issues.push('URL malformado');
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Validate DOI
   */
  private validateDoi(doi: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // DOI pattern: 10.xxxx/xxxxx
    const doiPattern = /^10\.\d{4,}\/.+$/;
    
    if (!doiPattern.test(doi)) {
      issues.push('Formato DOI inválido');
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Count valid references
   */
  private countValidReferences(references: IReference[]): number {
    return references.filter(ref => this.validateReference(ref).valid).length;
  }

  /**
   * Count invalid references
   */
  private countInvalidReferences(references: IReference[]): number {
    return references.filter(ref => {
      const validation = this.validateReference(ref);
      return !validation.valid && validation.issues.length > 1;
    }).length;
  }

  /**
   * Check citation format consistency
   */
  private checkCitationFormatConsistency(content: string): number {
    const authorYearMatches = (content.match(/\([A-Z][a-z]+,\s*\d{4}\)/g) || []).length;
    const numberedMatches = (content.match(/\[\d+\]/g) || []).length;
    
    // Mixed formats reduce consistency
    if (authorYearMatches > 0 && numberedMatches > 0) {
      return 0.7;
    }
    
    return 1;
  }

  /**
   * Assess quality of sources
   */
  private assessSourceQuality(references: IReference[]): number {
    if (references.length === 0) return 0;
    
    let qualityScore = 0;
    
    for (const ref of references) {
      // Check if from trusted publisher
      const isTrustedPublisher = this.academicPublishers.some(publisher =>
        ref.source.toLowerCase().includes(publisher.toLowerCase())
      );
      
      // Check if has DOI
      const hasDoi = !!ref.doi && this.validateDoi(ref.doi).valid;
      
      // Check recency (within last 10 years)
      const isRecent = ref.year >= new Date().getFullYear() - 10;
      
      // Calculate individual score
      let refScore = 0;
      if (isTrustedPublisher) refScore += 0.4;
      if (hasDoi) refScore += 0.3;
      if (isRecent) refScore += 0.3;
      
      qualityScore += refScore;
    }
    
    return Math.min(1, qualityScore / references.length);
  }

  /**
   * Generate suggestions for improving citations
   */
  private generateSuggestions(references: IReference[], content: string): string[] {
    const suggestions: string[] = [];
    
    // Check minimum references
    if (references.length < this.minReferences.research) {
      suggestions.push(`Adicione mais referências. Mínimo recomendado: ${this.minReferences.research}`);
    }
    
    // Check reference recency
    const oldReferences = references.filter(r => r.year < new Date().getFullYear() - 15);
    if (oldReferences.length > references.length * 0.5) {
      suggestions.push('Atualize suas referências com literatura mais recente');
    }
    
    // Check DOI coverage
    const withoutDoi = references.filter(r => !r.doi).length;
    if (withoutDoi > references.length * 0.3) {
      suggestions.push('Adicione DOIs às referências quando disponíveis');
    }
    
    // Check citation balance
    const citationCount = this.extractCitations(content).length;
    if (citationCount < references.length * 0.5) {
      suggestions.push('Algumas referências não parecem ser citadas no texto');
    }
    
    // Check for primary sources
    const hasPrimarySources = references.some(r => 
      r.source.toLowerCase().includes('journal') ||
      r.source.toLowerCase().includes('proceedings') ||
      r.source.toLowerCase().includes('conference')
    );
    
    if (!hasPrimarySources) {
      suggestions.push('Inclua fontes primárias (artigos de periódicos) além de fontes secundárias');
    }
    
    return suggestions;
  }
}

export default CitationValidator;
