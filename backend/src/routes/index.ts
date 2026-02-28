import { Router } from 'express';
import articleRoutes from './articleRoutes';
import userRoutes from './userRoutes';
import sblRoutes from './sblRoutes';

const router = Router();

router.use('/articles', articleRoutes);
router.use('/users', userRoutes);
router.use('/sbl', sblRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
