import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController';

const router = Router();
const articleController = new ArticleController();

// Article CRUD
router.post('/', articleController.createArticle);
router.get('/', articleController.listArticles);
router.get('/stats', articleController.getStatistics);
router.get('/:id', articleController.getArticle);

// Article workflow
router.post('/:id/submit', articleController.submitForValidation);
router.post('/:id/publish', articleController.publishArticle);
router.post('/:id/version', articleController.createVersion);

export default router;
