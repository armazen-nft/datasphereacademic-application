/**
 * ============================================
 * SEMANTIC VALIDATION MODULE
 * ============================================
 * 
 * Validates:
 * - Coherence conceitual
 * - Estrutura de argumento acadêmico
 * - Detecção de falácias e ruído
 * - Proposições sem sentido
 */

import { ISemanticValidationResult } from '../../../shared/types';

export class SemanticValidator {
  
  // Common logical fallacies patterns
  private fallacyPatterns = {
    adHominem: /\b(você é|você não|pessoa que|caráter de|atacar pessoalmente)\b/gi,
    strawMan: /\b(você está dizendo que|então você quer dizer|você quer)\b/gi,
    falseDichotomy: /\b(ou isso|ou aquilo|preto ou branco|tudo ou nada|sempre ou nunca)\b/gi,
    appealToAuthority: /\b(experts dizem|estudos mostram|todos sabem|é óbvio que)\b/gi,
    circularReasoning: /\b(porque é assim|é verdade porque|a razão é que)\b/gi,
    hastyGeneralization: /\b(sempre|nunca|todos|nenhum|toda vez que)\b/gi,
    slipperySlope: /\b(levará a|resultará em|cascata|efeito dominó)\b/gi,
    postHoc: /\b(depois disso|portanto por causa|seguiu então causou)\b/gi
  };

  // Academic structure indicators
  private academicIndicators = {
    hypothesis: /\b(hipótese|hipóteses|supomos que|assumimos que|testamos se)\b/gi,
    methodology: /\b(metodologia|método|procedimento|protocolo|amostra|dados foram)\b/gi,
    analysis: /\b(análise|analisamos|examinamos|investigamos|avaliação)\b/gi,
    conclusion: /\b(conclusão|concluímos|portanto|assim|resultado final)\b/gi,
    evidence: /\b(evidence|dados mostram|resultados indicam|encontramos)\b/gi
  };

  // Meaningless proposition patterns
  private meaninglessPatterns = [
    /\b(alguma coisa|certas coisas|várias coisas|muitas coisas)\b/gi,
    /\b(de certa forma|de alguma maneira|de um jeito)\b/gi,
    /\b(é o que é|acontece o que acontece|vai ser o que for)\b/gi,
    /\b(todo mundo sabe|ninguém discorda|é claro que sim)\b/gi
  ];

  /**
   * Main validation method
   */
  async validate(content: string, title: string, abstract: string): Promise<ISemanticValidationResult> {
    const coherence = this.calculateCoherence(content, abstract);
    const logicalConsistency = this.checkLogicalConsistency(content);
    const fallacies = this.detectFallacies(content);
    const meaninglessPropositions = this.detectMeaninglessPropositions(content);
    const suggestions = this.generateSuggestions(content, fallacies, meaninglessPropositions);

    return {
      coherence,
      logicalConsistency,
      fallacies,
      meaninglessPropositions,
      suggestions
    };
  }

  /**
   * Calculate semantic coherence between title, abstract and content
   */
  private calculateCoherence(content: string, abstract: string): number {
    const contentWords = this.extractKeyTerms(content);
    const abstractWords = this.extractKeyTerms(abstract);
    
    if (contentWords.length === 0 || abstractWords.length === 0) {
      return 0;
    }

    // Calculate overlap
    const overlap = contentWords.filter(word => abstractWords.includes(word));
    const coherenceScore = (overlap.length / Math.max(contentWords.length, abstractWords.length)) * 100;
    
    // Check for structural coherence
    const hasIntroduction = /\b(introdução|introduzimos|apresentamos|neste trabalho)\b/gi.test(content);
    const hasDevelopment = /\b(desenvolvimento|método|metodologia|análise)\b/gi.test(content);
    const hasConclusion = /\b(conclusão|concluímos|resultados|discussão)\b/gi.test(content);
    
    const structureScore = (hasIntroduction ? 25 : 0) + (hasDevelopment ? 25 : 0) + (hasConclusion ? 25 : 0);
    
    // Check paragraph coherence
    const paragraphs = content.split(/\n\n+/);
    let paragraphCoherence = 0;
    
    for (let i = 1; i < paragraphs.length; i++) {
      const prevWords = this.extractKeyTerms(paragraphs[i - 1]);
      const currWords = this.extractKeyTerms(paragraphs[i]);
      const paraOverlap = prevWords.filter(w => currWords.includes(w));
      
      if (paraOverlap.length > 0) {
        paragraphCoherence += 100 / paragraphs.length;
      }
    }
    
    return Math.min(100, (coherenceScore * 0.3) + (structureScore * 0.4) + (paragraphCoherence * 0.3));
  }

  /**
   * Check logical consistency throughout the content
   */
  private checkLogicalConsistency(content: string): number {
    const sentences = this.splitIntoSentences(content);
    let consistencyScore = 100;
    
    // Check for contradictions
    const contradictions = this.findContradictions(sentences);
    consistencyScore -= contradictions.length * 15;
    
    // Check for consistent terminology
    const termConsistency = this.checkTermConsistency(content);
    consistencyScore *= termConsistency;
    
    // Check argument flow
    const argumentFlow = this.checkArgumentFlow(sentences);
    consistencyScore *= argumentFlow;
    
    return Math.max(0, Math.min(100, consistencyScore));
  }

  /**
   * Detect logical fallacies in content
   */
  private detectFallacies(content: string): string[] {
    const fallacies: string[] = [];
    
    for (const [type, pattern] of Object.entries(this.fallacyPatterns)) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        fallacies.push(this.translateFallacyType(type));
      }
    }
    
    return [...new Set(fallacies)]; // Remove duplicates
  }

  /**
   * Detect meaningless or vague propositions
   */
  private detectMeaninglessPropositions(content: string): string[] {
    const propositions: string[] = [];
    const sentences = this.splitIntoSentences(content);
    
    for (const sentence of sentences) {
      for (const pattern of this.meaninglessPatterns) {
        if (pattern.test(sentence)) {
          propositions.push(sentence.trim());
          break;
        }
      }
      
      // Check for overly vague statements
      if (this.isVagueStatement(sentence)) {
        propositions.push(sentence.trim());
      }
    }
    
    return [...new Set(propositions)].slice(0, 10); // Limit to 10
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(
    content: string, 
    fallacies: string[], 
    meaningless: string[]
  ): string[] {
    const suggestions: string[] = [];
    
    // Academic structure suggestions
    const hasHypothesis = this.academicIndicators.hypothesis.test(content);
    const hasMethodology = this.academicIndicators.methodology.test(content);
    const hasAnalysis = this.academicIndicators.analysis.test(content);
    const hasConclusion = this.academicIndicators.conclusion.test(content);
    
    if (!hasHypothesis) {
      suggestions.push('Considere explicitar suas hipóteses de pesquisa');
    }
    if (!hasMethodology) {
      suggestions.push('Inclua uma seção de metodologia descrevendo seu procedimento');
    }
    if (!hasAnalysis) {
      suggestions.push('Adicione uma seção de análise dos dados ou argumentos');
    }
    if (!hasConclusion) {
      suggestions.push('Finalize com uma conclusão que sintetize seus achados');
    }
    
    // Fallacy suggestions
    if (fallacies.length > 0) {
      suggestions.push(`Revise possíveis falácias lógicas detectadas: ${fallacies.join(', ')}`);
    }
    
    // Vagueness suggestions
    if (meaningless.length > 0) {
      suggestions.push('Substitua proposições vagas por afirmações mais específicas e mensuráveis');
    }
    
    // Evidence check
    const hasEvidence = /\b(dados|evidência|resultado|estudo|pesquisa)\b/gi.test(content);
    if (!hasEvidence) {
      suggestions.push('Fortaleça seus argumentos com evidências empíricas ou referências');
    }
    
    return suggestions;
  }

  // Helper methods
  private extractKeyTerms(text: string): string[] {
    const cleaned = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\b(o|a|os|as|um|uma|de|da|do|em|no|na|para|por|com|sem|sob|sobre|entre|durante|antes|depois|quando|onde|que|se|mas|ou|e|não|sim|já|mais|menos|muito|pouco|todo|nenhum|outro|mesmo|próprio|tal|qual|cujo|cuja|quem|cujo|aonde|como|porque|pois|portanto|entretanto|contudo|todavia|ou seja|isto é|a saber)\b/g, '');
    
    const words = cleaned.split(/\s+/).filter(w => w.length > 3);
    return [...new Set(words)];
  }

  private splitIntoSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }

  private findContradictions(sentences: string[]): string[] {
    const contradictions: string[] = [];
    
    // Simple contradiction detection
    const negationPatterns = [
      { pos: /\b(é|são|existe|existem|tem|têm)\b/, neg: /\b(não é|não são|não existe|não existem|não tem|não têm)\b/ }
    ];
    
    for (let i = 0; i < sentences.length; i++) {
      for (let j = i + 1; j < sentences.length; j++) {
        for (const pattern of negationPatterns) {
          if (pattern.pos.test(sentences[i]) && pattern.neg.test(sentences[j])) {
            const similarity = this.calculateSimilarity(sentences[i], sentences[j]);
            if (similarity > 0.6) {
              contradictions.push(`Possível contradição entre: "${sentences[i].trim()}" e "${sentences[j].trim()}"`);
            }
          }
        }
      }
    }
    
    return contradictions;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    const intersection = words1.filter(w => words2.includes(w));
    return (2 * intersection.length) / (words1.length + words2.length);
  }

  private checkTermConsistency(content: string): number {
    const paragraphs = content.split(/\n\n+/);
    const termVariations: Map<string, string[]> = new Map();
    
    // Track term variations
    const keyTerms = this.extractKeyTerms(content).slice(0, 20);
    
    for (const term of keyTerms) {
      const variations = this.findVariations(content, term);
      if (variations.length > 2) {
        termVariations.set(term, variations);
      }
    }
    
    // Score based on consistency
    const inconsistentTerms = Array.from(termVariations.values()).filter(v => v.length > 3);
    return Math.max(0.5, 1 - (inconsistentTerms.length * 0.1));
  }

  private findVariations(content: string, term: string): string[] {
    const variations: string[] = [];
    const patterns = [
      new RegExp(`\\b${term}\\b`, 'gi'),
      new RegExp(`\\b${term}s?\\b`, 'gi'),
      new RegExp(`\\b${term.replace(/o$/, 'a')}\\b`, 'gi'),
      new RegExp(`\\b${term.replace(/a$/, 'o')}\\b`, 'gi')
    ];
    
    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        variations.push(...matches);
      }
    }
    
    return [...new Set(variations)];
  }

  private checkArgumentFlow(sentences: string[]): number {
    if (sentences.length < 3) return 0.5;
    
    let flowScore = 0;
    const connectors = ['portanto', 'assim', 'logo', 'consequentemente', 'por isso', 'dessa forma', 'em seguida', 'posteriormente', 'além disso', 'adicionalmente'];
    
    for (let i = 1; i < sentences.length; i++) {
      const hasConnector = connectors.some(c => 
        sentences[i].toLowerCase().includes(c)
      );
      if (hasConnector) flowScore++;
    }
    
    return Math.min(1, 0.5 + (flowScore / sentences.length));
  }

  private isVagueStatement(sentence: string): boolean {
    const vagueWords = ['algum', 'certo', 'vários', 'muitos', 'poucos', 'talvez', 'possivelmente', 'provavelmente', 'geralmente', 'normalmente'];
    const words = sentence.toLowerCase().split(/\s+/);
    const vagueCount = words.filter(w => vagueWords.some(vw => w.includes(vw))).length;
    return vagueCount > 2 || (vagueCount / words.length) > 0.3;
  }

  private translateFallacyType(type: string): string {
    const translations: Record<string, string> = {
      adHominem: 'Ad Hominem',
      strawMan: 'Falácia do Espantalho',
      falseDichotomy: 'Falsa Dicotomia',
      appealToAuthority: 'Apelo à Autoridade',
      circularReasoning: 'Raciocínio Circular',
      hastyGeneralization: 'Generalização Precipitada',
      slipperySlope: 'Declive Escorregadio',
      postHoc: 'Post Hoc Ergo Propter Hoc'
    };
    return translations[type] || type;
  }
}

export default SemanticValidator;
