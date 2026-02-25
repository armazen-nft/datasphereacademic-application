import axios from 'axios';
import { AIValidationDetail, ValidationResult } from '../types/paper.types';

export class AIValidator {
  async validatePaper(text: string): Promise<ValidationResult> {
    const results = await Promise.all([
      this.validateWithGPT(text),
      this.validateWithClaude(text),
      this.validateWithGemini(text)
    ]);

    const details = results;
    const approvedCount = details.filter((d) => d.approved).length;
    const avgScore = details.reduce((sum, d) => sum + d.score, 0) / details.length;

    return {
      status: approvedCount >= 2 ? 'APPROVED' : 'REJECTED',
      confidence: Number((avgScore / 10).toFixed(2)),
      details
    };
  }

  private async validateWithGPT(text: string): Promise<AIValidationDetail> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return this.unavailable('GPT-4', 'Missing OPENAI_API_KEY');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are a peer reviewer. Return exactly: SCORE: X (0-10) and REASON: short explanation.'
            },
            {
              role: 'user',
              content: `Paper:\n${text.substring(0, 3000)}`
            }
          ],
          max_tokens: 200
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      const raw = String(response.data?.choices?.[0]?.message?.content ?? '');
      return this.parseResponse('GPT-4', raw);
    } catch {
      return this.unavailable('GPT-4', 'API Error');
    }
  }

  private async validateWithClaude(text: string): Promise<AIValidationDetail> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return this.unavailable('Claude', 'Missing ANTHROPIC_API_KEY');
    }

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-5-sonnet-latest',
          max_tokens: 200,
          messages: [
            {
              role: 'user',
              content: `You are a peer reviewer. Return exactly: SCORE: X (0-10) and REASON: short explanation.\n\nPaper:\n${text.substring(0, 3000)}`
            }
          ]
        },
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      const raw = String(response.data?.content?.[0]?.text ?? '');
      return this.parseResponse('Claude', raw);
    } catch {
      return this.unavailable('Claude', 'API Error');
    }
  }

  private async validateWithGemini(text: string): Promise<AIValidationDetail> {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return this.unavailable('Gemini', 'Missing GOOGLE_API_KEY');
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a peer reviewer. Return exactly: SCORE: X (0-10) and REASON: short explanation.\n\nPaper:\n${text.substring(0, 3000)}`
                }
              ]
            }
          ]
        },
        { timeout: 15000 }
      );

      const raw = String(response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '');
      return this.parseResponse('Gemini', raw);
    } catch {
      return this.unavailable('Gemini', 'API Error');
    }
  }

  private parseResponse(aiName: string, response: string): AIValidationDetail {
    const scoreMatch = response.match(/SCORE:\s*(10|[0-9])/i);
    const score = scoreMatch ? Number(scoreMatch[1]) : 5;

    return {
      aiName,
      score,
      approved: score >= 7,
      reasoning: response.replace(/SCORE:\s*(10|[0-9])/i, '').trim() || 'No details returned.'
    };
  }

  private unavailable(aiName: string, reason: string): AIValidationDetail {
    return {
      aiName,
      score: 0,
      approved: false,
      reasoning: reason
    };
  }
}

export const aiValidator = new AIValidator();
