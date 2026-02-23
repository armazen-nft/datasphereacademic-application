import { IArticle } from '../../../shared/types';
import { IArticleDocument } from '../models/Article';
import { BaseMapper } from './baseMapper';

export class ArticleMapper extends BaseMapper<IArticleDocument, IArticle> {
  toDTO(doc: IArticleDocument): IArticle {
    return {
      id: doc.id || doc._id.toString(),
      title: doc.title,
      abstract: doc.abstract,
      content: doc.content,
      authorId: doc.authorId,
      authorType: doc.authorType,
      status: doc.status,
      keywords: doc.keywords,
      references: doc.references,
      hypotheses: doc.hypotheses,
      methodology: doc.methodology,
      findings: doc.findings,
      version: doc.version,
      versions: doc.versions,
      validations: doc.validations,
      requiredValidations: doc.requiredValidations,
      completedValidations: doc.completedValidations,
      qualityScores: doc.qualityScores,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      publishedAt: doc.publishedAt,
      views: doc.views,
      citations: doc.citations,
      downloads: doc.downloads
    };
  }
}

export const articleMapper = new ArticleMapper();
