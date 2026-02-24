import { Router } from 'express';
import { Paper } from '../models/Paper';
import { PaperMapper } from '../mappers/paperMapper';
import { aiValidator } from '../services/aiValidator';
import { CreatePaperDTO } from '../types/paper.types';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const papers = await Paper.find().sort({ createdAt: -1 });
    res.json(PaperMapper.toDTOArray(papers));
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

router.post('/', async (req, res) => {
  try {
    const createDTO: CreatePaperDTO = req.body;
    const paper = new Paper(createDTO);
    await paper.save();
    res.status(201).json(PaperMapper.toDTO(paper));
  } catch (error) {
    console.error('Error creating paper:', error);
    res.status(400).json({ error: 'Invalid paper data' });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { text } = req.body as { text?: string };

    if (!text || text.length < 100) {
      return res.status(400).json({ error: 'Paper text must be at least 100 characters' });
    }

    const result = await aiValidator.validatePaper(text);
    return res.json(result);
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ error: 'Validation failed' });
  }
});

export default router;
