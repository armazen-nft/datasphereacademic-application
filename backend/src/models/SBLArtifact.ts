import mongoose, { Document, Schema } from 'mongoose';

export interface ISBLArtifact {
  articleId?: string;
  sourceAgentId: string;
  embedding: number[];
  citationGraph: string[];
  cte: {
    energyEstimate: number;
    irreversibility: number;
    score: number;
  };
  compressedPayload: string;
  createdAt: Date;
}

export interface ISBLArtifactDocument extends ISBLArtifact, Document {}

const SBLArtifactSchema = new Schema<ISBLArtifactDocument>({
  articleId: { type: String },
  sourceAgentId: { type: String, required: true },
  embedding: [{ type: Number, required: true }],
  citationGraph: [{ type: String, required: true }],
  cte: {
    energyEstimate: { type: Number, required: true },
    irreversibility: { type: Number, required: true },
    score: { type: Number, required: true }
  },
  compressedPayload: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

SBLArtifactSchema.index({ sourceAgentId: 1, createdAt: -1 });
SBLArtifactSchema.index({ articleId: 1 });

export const SBLArtifact = mongoose.model<ISBLArtifactDocument>('SBLArtifact', SBLArtifactSchema);
