import axios from 'axios';

export type ProviderVerdict = 'approved' | 'revision_needed';

export interface ProviderEvaluation {
  provider: 'openai' | 'anthropic' | 'gemini';
  verdict: ProviderVerdict;
  score: number;
  rationale: string;
  simulated: boolean;
}

export interface ValidationRequest {
  title?: string;
  abstract?: string;
  content: string;
}

export interface ValidationResponse {
  consensus: ProviderVerdict;
  confidence: number;
  evaluations: ProviderEvaluation[];
  summary: string;
}

interface ParsedLLMResponse {
  verdict: ProviderVerdict;
  score: number;
  rationale: string;
}

export class ValidationConsensusService {
  async validate(payload: ValidationRequest): Promise<ValidationResponse> {
    const prompt = this.buildPrompt(payload);

    const evaluations = await Promise.all([
      this.evaluateWithOpenAI(prompt),
      this.evaluateWithAnthropic(prompt),
      this.evaluateWithGemini(prompt)
    ]);

    const approved = evaluations.filter((item) => item.verdict === 'approved').length;
    const revision = evaluations.length - approved;
    const consensus: ProviderVerdict = approved >= revision ? 'approved' : 'revision_needed';

    const confidence = Math.round((Math.max(approved, revision) / evaluations.length) * 100);

    return {
      consensus,
      confidence,
      evaluations,
      summary: this.buildSummary(consensus, confidence, evaluations)
    };
  }

  private buildPrompt(payload: ValidationRequest): string {
    return [
      'You are reviewing an academic paper for initial quality screening.',
      'Return a strict JSON object with keys: verdict, score, rationale.',
      'verdict must be approved or revision_needed. score must be 0-100.',
      `Title: ${payload.title ?? 'Untitled'}`,
      `Abstract: ${payload.abstract ?? 'N/A'}`,
      `Content: ${payload.content}`
    ].join('\n');
  }

  private async evaluateWithOpenAI(prompt: string): Promise<ProviderEvaluation> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return this.simulate('openai', prompt);
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          temperature: 0.1,
          messages: [
            { role: 'system', content: 'Return only valid JSON.' },
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      );

      const content = response.data?.choices?.[0]?.message?.content ?? '';
      const parsed = this.parseLLMResponse(content);
      return { provider: 'openai', simulated: false, ...parsed };
    } catch {
      return this.simulate('openai', prompt);
    }
  }

  private async evaluateWithAnthropic(prompt: string): Promise<ProviderEvaluation> {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return this.simulate('anthropic', prompt);
    }

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
          max_tokens: 300,
          temperature: 0.1,
          messages: [{ role: 'user', content: prompt }]
        },
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      );

      const content = response.data?.content?.[0]?.text ?? '';
      const parsed = this.parseLLMResponse(content);
      return { provider: 'anthropic', simulated: false, ...parsed };
    } catch {
      return this.simulate('anthropic', prompt);
    }
  }

  private async evaluateWithGemini(prompt: string): Promise<ProviderEvaluation> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return this.simulate('gemini', prompt);
    }

    try {
      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      );

      const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const parsed = this.parseLLMResponse(content);
      return { provider: 'gemini', simulated: false, ...parsed };
    } catch {
      return this.simulate('gemini', prompt);
    }
  }

  private parseLLMResponse(raw: string): ParsedLLMResponse {
    try {
      const jsonStart = raw.indexOf('{');
      const jsonEnd = raw.lastIndexOf('}');
      const snippet = jsonStart >= 0 && jsonEnd > jsonStart ? raw.slice(jsonStart, jsonEnd + 1) : raw;
      const parsed = JSON.parse(snippet);
      const verdict: ProviderVerdict = parsed.verdict === 'approved' ? 'approved' : 'revision_needed';
      const score = Math.max(0, Math.min(100, Number(parsed.score) || 0));
      const rationale = String(parsed.rationale || 'No rationale provided').slice(0, 500);
      return { verdict, score, rationale };
    } catch {
      return {
        verdict: 'revision_needed',
        score: 40,
        rationale: 'Unable to parse provider output as strict JSON.'
      };
    }
  }

  private simulate(provider: ProviderEvaluation['provider'], prompt: string): ProviderEvaluation {
    const lengthScore = Math.min(100, Math.round((prompt.length / 4000) * 100));
    const score = Math.max(35, lengthScore);
    const verdict: ProviderVerdict = score >= 60 ? 'approved' : 'revision_needed';

    return {
      provider,
      verdict,
      score,
      rationale: 'Simulated evaluation used because provider API key is missing or request failed.',
      simulated: true
    };
  }

  private buildSummary(
    consensus: ProviderVerdict,
    confidence: number,
    evaluations: ProviderEvaluation[]
  ): string {
    const providerSummary = evaluations
      .map((item) => `${item.provider}:${item.verdict}${item.simulated ? '(simulated)' : ''}`)
      .join(', ');

    return `Consensus=${consensus}; confidence=${confidence}%; providers=[${providerSummary}]`;
  }
}

export default ValidationConsensusService;
