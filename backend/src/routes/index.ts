import { Router } from 'express';
import articleRoutes from './articleRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/articles', articleRoutes);
router.use('/users', userRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
