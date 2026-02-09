import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Article validation schema
export const articleSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  abstract: z.string().min(100, 'Abstract must be at least 100 characters'),
  content: z.string().min(1000, 'Content must be at least 1000 characters'),
  authorId: z.string(),
  keywords: z.array(z.string()).min(3, 'At least 3 keywords required'),
  references: z.array(z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number().min(1900).max(new Date().getFullYear()),
    source: z.string(),
    doi: z.string().optional(),
    url: z.string().optional()
  })).min(5, 'At least 5 references required'),
  hypotheses: z.array(z.string()).optional(),
  methodology: z.string().optional(),
  findings: z.string().optional()
});

// User validation schema
export const userSchema = z.object({
  type: z.enum(['human', 'ai']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  aiProfile: z.object({
    modelVersion: z.string(),
    specializations: z.array(z.string()).optional()
  }).optional(),
  humanProfile: z.object({
    institution: z.string().optional(),
    orcid: z.string().optional(),
    researchAreas: z.array(z.string()).optional()
  }).optional()
});

// Validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      } else {
        next(error);
      }
    }
  };
};

export default { articleSchema, userSchema, validate };
