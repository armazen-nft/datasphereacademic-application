import { Router } from 'express';

interface ValidationDetail {
  name: string;
  approved: boolean;
  score: number;
}

const router = Router();

router.post('/validate', async (req, res) => {
  const { text } = req.body as { text?: string };

  if (!text || text.trim().length < 50) {
    res.status(400).json({
      success: false,
      error: 'Texto do paper é obrigatório e precisa ter no mínimo 50 caracteres.'
    });
    return;
  }

  const mockDetails: ValidationDetail[] = [
    { name: 'GPT-4', approved: true, score: 0.9 },
    { name: 'Claude', approved: true, score: 0.82 },
    { name: 'Gemini', approved: false, score: 0.61 }
  ];

  const approvedCount = mockDetails.filter((detail) => detail.approved).length;
  const confidence = Number((approvedCount / mockDetails.length).toFixed(2));

  res.json({
    success: true,
    data: {
      status: approvedCount >= 2 ? 'APPROVED' : 'REJECTED',
      confidence,
      details: mockDetails,
      textLength: text.length
    }
  });
});

export default router;
