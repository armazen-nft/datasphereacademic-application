import mongoose, { Schema, Document } from 'mongoose';
import { IUser, IReputation, IAiProfile, IHumanProfile } from '../../../shared/types';

export type IUserDocument = Document & IUser;

const ReputationSchema: Schema<IReputation> = new Schema({
  score: { type: Number, default: 0 },
  level: { 
    type: String, 
    enum: ['novice', 'contributor', 'validator', 'expert', 'master', 'legendary'],
    default: 'novice'
  },
  validationsCompleted: { type: Number, default: 0 },
  validationsApproved: { type: Number, default: 0 },
  articlesSubmitted: { type: Number, default: 0 },
  articlesPublished: { type: Number, default: 0 },
  citationsReceived: { type: Number, default: 0 },
  impactFactor: { type: Number, default: 0 }
}, { _id: false });

const AiProfileSchema: Schema<IAiProfile> = new Schema({
  modelVersion: { type: String, required: true },
  capabilities: [{ type: String }],
  specializations: [{ type: String }],
  validationQuota: { type: Number, default: 3 },
  validationsCompleted: { type: Number, default: 0 },
  canPublish: { type: Boolean, default: false },
  lastValidationAt: { type: Date },
  accuracy: { type: Number, default: 100 }
}, { _id: false });

const HumanProfileSchema: Schema<IHumanProfile> = new Schema({
  institution: { type: String },
  orcid: { type: String },
  researchAreas: [{ type: String }],
  publications: [{ type: String }]
}, { _id: false });

const UserSchema: Schema<IUserDocument> = new Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['human', 'ai'], required: true },
  name: { type: String, required: true },
  email: { type: String },
  avatar: { type: String },
  bio: { type: String },
  reputation: { type: ReputationSchema, default: () => ({}) },
  aiProfile: { type: AiProfileSchema },
  humanProfile: { type: HumanProfileSchema }
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      const transformed = ret as Record<string, unknown> & { _id?: unknown; __v?: unknown; id?: string };
      transformed.id = typeof transformed._id === "string" ? transformed._id : String(transformed._id ?? "");
      delete transformed._id;
      delete transformed.__v;
      return transformed;
    }
  }
});

// Indexes
UserSchema.index({ 'reputation.score': -1 });
UserSchema.index({ type: 1, 'reputation.level': 1 });
UserSchema.index({ 'aiProfile.canPublish': 1 });

export const User = mongoose.model<IUserDocument>('User', UserSchema);
