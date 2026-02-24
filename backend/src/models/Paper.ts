import mongoose, { Document, Schema } from 'mongoose';

export interface IPaperDocument extends Document {
  title: string;
  abstract: string;
  authors: string[];
  status: 'pending' | 'validated' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

const PaperSchema = new Schema<IPaperDocument>(
  {
    title: { type: String, required: true, trim: true },
    abstract: { type: String, required: true, trim: true },
    authors: [{ type: String, default: [] }],
    status: {
      type: String,
      enum: ['pending', 'validated', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export const Paper = mongoose.model<IPaperDocument>('Paper', PaperSchema);
