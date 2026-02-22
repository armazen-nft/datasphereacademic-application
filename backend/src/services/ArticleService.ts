import { Article, IArticleDocument } from '../models/Article';
import { User } from '../models/User';
import { AIValidator } from '../ai-modules/AIValidator';
import { MeritocracyEngine } from '../ai-modules/MeritocracyEngine';
import { 
  IArticle, 
  IValidation, 
  IArticleVersion,
  ApiResponse,
  PaginatedResponse 
} from '../../../shared/types';

export class ArticleService {
  private aiValidator: AIValidator;
  private meritocracyEngine: MeritocracyEngine;

  constructor() {
    this.aiValidator = new AIValidator();
    this.meritocracyEngine = new MeritocracyEngine();
  }

  /**
   * Create a new article
   */
  async createArticle(articleData: Partial<IArticle>): Promise<ApiResponse<IArticle>> {
    try {
      // Validate author exists
      const author = await User.findOne({ id: articleData.authorId });
      if (!author) {
        return { success: false, error: 'Author not found' };
      }

      // Check if AI author can publish
      if (author.type === 'ai' && !this.meritocracyEngine.canPublish(author)) {
        const quota = this.meritocracyEngine.getValidationQuota(author);
        return { 
          success: false, 
          error: `AI must complete ${quota.remaining} more validations before publishing` 
        };
      }

      // Pre-filter check
      const preFilter = await this.aiValidator.preFilterCheck(articleData as IArticle);
      if (!preFilter.passed) {
        return { 
          success: false, 
          error: 'Article does not meet minimum requirements',
          message: preFilter.issues.join('; ')
        };
      }

      // Create article
      const articleId = `art_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const article = new Article({
        id: articleId,
        ...articleData,
        status: 'submitted',
        version: 1,
        versions: [{
          version: 1,
          content: articleData.content,
          changes: 'Initial submission',
          createdAt: new Date(),
          createdBy: articleData.authorId
        }],
        qualityScores: preFilter.scores
      });

      await article.save();

      // Update author's article count
      author.reputation.articlesSubmitted++;
      await author.save();

      return { success: true, data: article.toJSON() as IArticle };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Submit article for validation
   */
  async submitForValidation(articleId: string): Promise<ApiResponse<IArticle>> {
    try {
      const article = await Article.findOne({ id: articleId });
      if (!article) {
        return { success: false, error: 'Article not found' };
      }

      if (article.status !== 'draft' && article.status !== 'revision_required') {
        return { success: false, error: 'Article cannot be submitted for validation' };
      }

      // Update status
      article.status = 'under_review';
      await article.save();

      // Trigger AI validation
      await this.triggerAIValidation(article);

      return { success: true, data: article.toJSON() as IArticle };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Trigger AI validation for an article
   */
  private async triggerAIValidation(article: IArticleDocument): Promise<void> {
    // Find available AI validators
    const aiValidators = await User.find({ 
      type: 'ai',
      'aiProfile.canPublish': true 
    }).limit(5);

    if (aiValidators.length < 3) {
      // Not enough AI validators, use system AI
      const systemValidators = await this.createSystemValidators(3 - aiValidators.length);
      aiValidators.push(...systemValidators);
    }

    // Get existing articles for originality check
    const existingArticles = await Article.find({ 
      status: 'published',
      id: { $ne: article.id }
    }).select('content').limit(50);

    const existingContents = existingArticles.map(a => a.content);

    // Perform consensus validation
    const consensus = await this.aiValidator.performConsensusValidation(
      article.toJSON() as unknown as IArticle,
      aiValidators.map(v => v.toJSON()),
      existingContents
    );

    // Save validations
    article.validations.push(...consensus.validations);
    article.completedValidations = consensus.validations.length;

    // Update quality scores
    article.qualityScores = this.aiValidator.calculateQualityScores(
      article.toJSON() as unknown as IArticle
    );

    // Determine final status
    if (consensus.consensus === 'approved' && consensus.confidence >= 70) {
      article.status = 'approved';
    } else if (consensus.consensus === 'rejected') {
      article.status = 'rejected';
    } else {
      article.status = 'revision_required';
    }

    await article.save();

    // Update validators' reputation
    for (let i = 0; i < aiValidators.length; i++) {
      const validator = aiValidators[i];
      const validation = consensus.validations[i];
      const finalDecision = article.status === 'approved' ? 'approved' : 'rejected';
      
      const updatedValidator = this.meritocracyEngine.updateAfterValidation(
        validator.toJSON(),
        validation,
        finalDecision
      );
      
      await User.updateOne({ id: validator.id }, updatedValidator);
    }
  }

  /**
   * Create system AI validators
   */
  private async createSystemValidators(count: number): Promise<any[]> {
    const validators = [];
    
    for (let i = 0; i < count; i++) {
      const systemAI = new User({
        id: `sys_ai_${Date.now()}_${i}`,
        type: 'ai',
        name: `System Validator ${i + 1}`,
        aiProfile: this.meritocracyEngine.initializeAiProfile('system-v1', ['general']),
        reputation: {
          score: 500,
          level: 'expert',
          validationsCompleted: 100,
          validationsApproved: 95,
          articlesSubmitted: 0,
          articlesPublished: 0,
          citationsReceived: 0,
          impactFactor: 0
        }
      });
      
      await systemAI.save();
      validators.push(systemAI);
    }
    
    return validators;
  }

  /**
   * Publish an approved article
   */
  async publishArticle(articleId: string): Promise<ApiResponse<IArticle>> {
    try {
      const article = await Article.findOne({ id: articleId });
      if (!article) {
        return { success: false, error: 'Article not found' };
      }

      if (article.status !== 'approved') {
        return { success: false, error: 'Article must be approved before publishing' };
      }

      article.status = 'published';
      article.publishedAt = new Date();
      await article.save();

      // Update author's published count
      const author = await User.findOne({ id: article.authorId });
      if (author) {
        author.reputation.articlesPublished++;
        await author.save();
      }

      return { success: true, data: article.toJSON() as IArticle };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get article by ID
   */
  async getArticle(articleId: string): Promise<ApiResponse<IArticle>> {
    try {
      const article = await Article.findOne({ id: articleId });
      if (!article) {
        return { success: false, error: 'Article not found' };
      }

      // Increment views
      article.views++;
      await article.save();

      return { success: true, data: article.toJSON() as IArticle };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * List articles with pagination and filters
   */
  async listArticles(
    page: number = 1,
    limit: number = 10,
    filters: { status?: string; authorId?: string; keywords?: string[] } = {}
  ): Promise<ApiResponse<PaginatedResponse<IArticle>>> {
    try {
      const query: any = {};
      
      if (filters.status) {
        query.status = filters.status;
      }
      
      if (filters.authorId) {
        query.authorId = filters.authorId;
      }
      
      if (filters.keywords && filters.keywords.length > 0) {
        query.keywords = { $in: filters.keywords };
      }

      const skip = (page - 1) * limit;
      
      const [articles, total] = await Promise.all([
        Article.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Article.countDocuments(query)
      ]);

      return {
        success: true,
        data: {
          items: articles.map(a => a.toJSON() as IArticle),
          total,
          page,
          limit,
          hasMore: skip + articles.length < total
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Create new version of article
   */
  async createVersion(
    articleId: string, 
    newContent: string, 
    changes: string,
    userId: string
  ): Promise<ApiResponse<IArticle>> {
    try {
      const article = await Article.findOne({ id: articleId });
      if (!article) {
        return { success: false, error: 'Article not found' };
      }

      // Create new version
      const newVersion: IArticleVersion = {
        version: article.version + 1,
        content: newContent,
        changes,
        createdAt: new Date(),
        createdBy: userId
      };

      article.versions.push(newVersion);
      article.version = newVersion.version;
      article.content = newContent;
      article.status = 'revision_required';
      article.validations = [];
      article.completedValidations = 0;
      
      await article.save();

      return { success: true, data: article.toJSON() as IArticle };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get article statistics
   */
  async getStatistics(): Promise<ApiResponse<any>> {
    try {
      const stats = await Article.aggregate([
        {
          $group: {
            _id: null,
            totalArticles: { $sum: 1 },
            publishedArticles: {
              $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
            },
            pendingValidations: {
              $sum: { $cond: [{ $eq: ['$status', 'under_review'] }, 1, 0] }
            },
            totalViews: { $sum: '$views' },
            totalCitations: { $sum: '$citations' },
            avgQualityScore: { $avg: '$qualityScores.overall' }
          }
        }
      ]);

      // Get last 30 days growth
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailyStats = await Article.aggregate([
        {
          $match: { createdAt: { $gte: thirtyDaysAgo } }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return {
        success: true,
        data: {
          ...stats[0],
          networkGrowth: dailyStats.map(d => d.count)
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}

export default ArticleService;
