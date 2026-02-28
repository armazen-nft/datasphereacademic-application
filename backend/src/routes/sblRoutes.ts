import { Router } from 'express';
import { SBLService } from '../services/SBLService';

const router = Router();
const sblService = new SBLService();

router.post('/ideogram/create', async (req, res, next) => {
  try {
    const { model_id: modelId, paper_id: paperId, semantic_vector: semanticVector, confidence, critique } = req.body;

    if (!modelId || !paperId || !Array.isArray(semanticVector)) {
      return res.status(400).json({ success: false, error: 'model_id, paper_id and semantic_vector are required' });
    }

    const ideogram = await sblService.createIdeogram({
      model_id: modelId,
      paper_id: paperId,
      semantic_vector: semanticVector,
      confidence,
      critique
    });

    return res.status(201).json({ success: true, ideogram });
  } catch (error) {
    return next(error);
  }
});

router.post('/compatibility', async (req, res, next) => {
  try {
    const { ideogram_A_id: ideogramAId, ideogram_B_id: ideogramBId } = req.body;
    if (!ideogramAId || !ideogramBId) {
      return res.status(400).json({ success: false, error: 'ideogram_A_id and ideogram_B_id are required' });
    }

    const result = await sblService.compatibility(ideogramAId, ideogramBId);
    return res.json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
});

router.get('/reputation/:modelId', async (req, res, next) => {
  try {
    const rep = await sblService.getModelReputation(req.params.modelId);
    return res.json({ success: true, reputation: rep });
  } catch (error) {
    return next(error);
  }
});

router.post('/reputation/:modelId/update', async (req, res, next) => {
  try {
    const { outcome, errorMagnitude = 0 } = req.body;
    if (!outcome || !['success', 'error', 'violation'].includes(outcome)) {
      return res.status(400).json({ success: false, error: 'outcome must be success, error or violation' });
    }

    const reputation = await sblService.updateModelReputation(req.params.modelId, outcome, Number(errorMagnitude));
    return res.json({ success: true, reputation });
  } catch (error) {
    return next(error);
  }
});

router.post('/consensus', async (req, res, next) => {
  try {
    const { paper_id: paperId } = req.body;
    if (!paperId) {
      return res.status(400).json({ success: false, error: 'paper_id is required' });
    }

    const result = await sblService.consensus(paperId);
    return res.json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
});

export default router;
