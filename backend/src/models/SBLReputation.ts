import mongoose, { Document, Schema } from 'mongoose';

export interface ISBLReputation {
  agentId: string;
  shortTerm: number;
  longTerm: number;
  history: number[];
  updatedAt: Date;
}

export interface ISBLReputationDocument extends ISBLReputation, Document {}

const SBLReputationSchema = new Schema<ISBLReputationDocument>({
  agentId: { type: String, required: true, unique: true },
  shortTerm: { type: Number, default: 0 },
  longTerm: { type: Number, default: 0 },
  history: [{ type: Number, required: true }],
  updatedAt: { type: Date, default: Date.now }
});

SBLReputationSchema.index({ longTerm: -1 });

export const SBLReputation = mongoose.model<ISBLReputationDocument>('SBLReputation', SBLReputationSchema);
