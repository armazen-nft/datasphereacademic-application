import { Request, Response } from 'express';
import { SBLService } from '../services/SBLService';

export class SBLController {
  private sblService: SBLService;

  constructor() {
    this.sblService = new SBLService();
  }

  ingestIdeogram = async (req: Request, res: Response): Promise<void> => {
    try {
      const { articleId, sourceAgentId, embedding, citationGraph } = req.body as {
        articleId?: string;
        sourceAgentId?: string;
        embedding?: number[];
        citationGraph?: string[];
      };

      if (!sourceAgentId || !Array.isArray(embedding) || embedding.length === 0) {
        res.status(400).json({
          success: false,
          error: 'sourceAgentId and a non-empty embedding array are required'
        });
        return;
      }

      const result = await this.sblService.ingestIdeogram({
        articleId,
        sourceAgentId,
        embedding,
        citationGraph
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  getReputation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { agentId } = req.params;
      const result = await this.sblService.getReputation(agentId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };
}
