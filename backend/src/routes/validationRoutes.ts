import { Router } from 'express';
import ValidationController from '../controllers/ValidationController';

const router = Router();
const validationController = new ValidationController();

router.post('/', validationController.validatePaper);

export default router;
