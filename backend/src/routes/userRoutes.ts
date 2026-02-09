import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

// User CRUD
router.post('/', userController.createUser);
router.get('/', userController.listUsers);
router.get('/initialize', userController.initializeUsers);
router.get('/leaderboard', userController.getLeaderboard);
router.get('/eligible-validators', userController.getEligibleAIValidators);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// AI-specific routes
router.get('/:id/quota', userController.getValidationQuota);
router.post('/:id/bonus', userController.awardBonus);
router.post('/:id/penalty', userController.applyPenalty);

export default router;
