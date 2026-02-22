import { Router } from 'express';
import { SBLController } from '../controllers/SBLController';

const router = Router();
const sblController = new SBLController();

router.post('/ideogram', sblController.ingestIdeogram);
router.get('/reputation/:agentId', sblController.getReputation);

export default router;
