import mongoose, { Document, Schema } from 'mongoose';

export interface IIdeogramDocument extends Document {
  sbl_version: string;
  ideogram_id: string;
  model_id: string;
  paper_id: string;
  timestamp: Date;
  content_manifest: any[];
  operations_applied: any[];
  metrics: {
    error: number;
    stability: number;
    drift: number;
    semantic_coherence: number;
    consensus_ready: boolean;
  };
  signature?: Record<string, unknown>;
}

export interface IModelReputationDocument extends Document {
  model_id: string;
  reputation_short: number;
  reputation_long: number;
  review_count: number;
  successful_reviews: number;
  penalty_flag: boolean;
  rehabilitation_until?: Date;
  updated_at: Date;
}

const IdeogramSchema = new Schema({
  sbl_version: { type: String, required: true },
  ideogram_id: { type: String, required: true, unique: true, index: true },
  model_id: { type: String, required: true, index: true },
  paper_id: { type: String, required: true, index: true },
  timestamp: { type: Date, required: true },
  content_manifest: { type: Array, default: [] },
  operations_applied: { type: Array, default: [] },
  metrics: {
    error: { type: Number, required: true },
    stability: { type: Number, required: true },
    drift: { type: Number, required: true },
    semantic_coherence: { type: Number, required: true },
    consensus_ready: { type: Boolean, required: true }
  },
  signature: { type: Schema.Types.Mixed }
}, { timestamps: false });

IdeogramSchema.index({ paper_id: 1, model_id: 1 });

const ModelReputationSchema = new Schema({
  model_id: { type: String, required: true, unique: true, index: true },
  reputation_short: { type: Number, required: true, default: 0.5 },
  reputation_long: { type: Number, required: true, default: 0.5 },
  review_count: { type: Number, required: true, default: 0 },
  successful_reviews: { type: Number, required: true, default: 0 },
  penalty_flag: { type: Boolean, required: true, default: false },
  rehabilitation_until: { type: Date },
  updated_at: { type: Date, required: true, default: Date.now }
}, { timestamps: false });

export const SBLIdeogram = mongoose.model<IIdeogramDocument>('SBLIdeogram', IdeogramSchema);
export const SBLModelReputation = mongoose.model<IModelReputationDocument>('SBLModelReputation', ModelReputationSchema);
