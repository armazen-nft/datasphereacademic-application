import mongoose, { Schema, HydratedDocument } from 'mongoose';
import { IArticle, IArticleVersion, IReference, IValidation, IQualityScores } from '../../../shared/types';

export type IArticleDocument = HydratedDocument<IArticle>;

const ArticleVersionSchema: Schema<IArticleVersion> = new Schema({
  version: { type: Number, required: true },
  content: { type: String, required: true },
  changes: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true }
}, { _id: false });

const ReferenceSchema: Schema<IReference> = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  authors: [{ type: String }],
  year: { type: Number, required: true },
  source: { type: String, required: true },
  doi: { type: String },
  url: { type: String },
  verified: { type: Boolean, default: false }
}, { _id: false });

const AutomatedAnalysisSchema = new Schema({
  semanticCoherence: { type: Number },
  logicalConsistency: { type: Number },
  citationQuality: { type: Number },
  fallacyDetection: [{ type: String }],
  plagiarismRisk: { type: Number },
  academicDepth: { type: Number }
}, { _id: false });

const ValidationSchema: Schema<IValidation> = new Schema({
  id: { type: String, required: true },
  articleId: { type: String, required: true },
  validatorId: { type: String, required: true },
  validatorType: { type: String, enum: ['human', 'ai'], required: true },
  scores: {
    coherence: { type: Number, required: true },
    foundation: { type: Number, required: true },
    originality: { type: Number, required: true },
    methodology: { type: Number, required: true },
    relevance: { type: Number, required: true }
  },
  overallScore: { type: Number, required: true },
  result: { type: String, enum: ['pending', 'approved', 'rejected'], required: true },
  comments: { type: String },
  suggestions: [{ type: String }],
  automatedAnalysis: { type: AutomatedAnalysisSchema },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const QualityScoresSchema: Schema<IQualityScores> = new Schema({
  semantic: { type: Number, default: 0 },
  logical: { type: Number, default: 0 },
  citations: { type: Number, default: 0 },
  originality: { type: Number, default: 0 },
  depth: { type: Number, default: 0 },
  overall: { type: Number, default: 0 }
}, { _id: false });

const ArticleSchema: Schema<IArticle> = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  authorType: { type: String, enum: ['human', 'ai'], required: true },
  status: { 
    type: String, 
    enum: ['draft', 'submitted', 'under_review', 'revision_required', 'approved', 'published', 'rejected'],
    default: 'draft'
  },
  keywords: [{ type: String }],
  references: [ReferenceSchema],
  hypotheses: [{ type: String }],
  methodology: { type: String },
  findings: { type: String },
  version: { type: Number, default: 1 },
  versions: [ArticleVersionSchema],
  validations: [ValidationSchema],
  requiredValidations: { type: Number, default: 3 },
  completedValidations: { type: Number, default: 0 },
  qualityScores: { type: QualityScoresSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date },
  views: { type: Number, default: 0 },
  citations: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: any) => {
      ret.id = ret.id ?? ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
ArticleSchema.index({ status: 1, createdAt: -1 });
ArticleSchema.index({ authorId: 1 });
ArticleSchema.index({ keywords: 1 });
ArticleSchema.index({ 'qualityScores.overall': -1 });
ArticleSchema.index({ citations: -1 });

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);
