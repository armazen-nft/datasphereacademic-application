import { Request, Response } from 'express';
import { ArticleService } from '../services/ArticleService';

export class ArticleController {
  private articleService: ArticleService;

  constructor() {
    this.articleService = new ArticleService();
  }

  /**
   * Create a new article
   */
  createArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.articleService.createArticle(req.body);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Get article by ID
   */
  getArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.articleService.getArticle(id);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * List articles with pagination
   */
  listArticles = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const authorId = req.query.authorId as string;
      const keywords = req.query.keywords ? (req.query.keywords as string).split(',') : undefined;

      const result = await this.articleService.listArticles(page, limit, {
        status,
        authorId,
        keywords
      });
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Submit article for validation
   */
  submitForValidation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.articleService.submitForValidation(id);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Publish an approved article
   */
  publishArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.articleService.publishArticle(id);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Create new version of article
   */
  createVersion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { content, changes, userId } = req.body;
      
      const result = await this.articleService.createVersion(id, content, changes, userId);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  /**
   * Get article statistics
   */
  getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.articleService.getStatistics();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };
}

export default ArticleController;
