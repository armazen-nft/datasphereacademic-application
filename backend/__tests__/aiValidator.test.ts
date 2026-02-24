import { aiValidator } from '../src/services/aiValidator';

describe('AIValidator', () => {
  it('returns a deterministic payload structure', async () => {
    jest.spyOn<any, any>(aiValidator as any, 'validateWithGPT').mockResolvedValue({
      aiName: 'GPT-4',
      score: 8,
      approved: true,
      reasoning: 'Strong methodology.'
    });
    jest.spyOn<any, any>(aiValidator as any, 'validateWithClaude').mockResolvedValue({
      aiName: 'Claude',
      score: 7,
      approved: true,
      reasoning: 'Well-written.'
    });
    jest.spyOn<any, any>(aiValidator as any, 'validateWithGemini').mockResolvedValue({
      aiName: 'Gemini',
      score: 5,
      approved: false,
      reasoning: 'Needs stronger references.'
    });

    const result = await aiValidator.validatePaper('x'.repeat(400));

    expect(result.status).toBe('APPROVED');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.details).toHaveLength(3);
  });
});
