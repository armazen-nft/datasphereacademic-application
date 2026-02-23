import { Request, Response } from 'express';
import ValidationConsensusService from '../services/ValidationConsensusService';

export class ValidationController {
  private validationService: ValidationConsensusService;

  constructor() {
    this.validationService = new ValidationConsensusService();
  }

  validatePaper = async (req: Request, res: Response): Promise<void> => {
    try {
      const { content, title, abstract } = req.body;

      if (!content || typeof content !== 'string' || content.trim().length < 200) {
        res.status(400).json({
          success: false,
          error: 'Field "content" is required and must have at least 200 characters.'
        });
        return;
      }

      const result = await this.validationService.validate({
        content,
        title,
        abstract
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message
      });
    }
  };
}

export default ValidationController;
