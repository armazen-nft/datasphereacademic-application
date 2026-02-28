import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export type ContentType = 'semantic_vector' | 'structured_critique' | 'dependency_graph';

export interface ContentManifestItem {
  type: ContentType;
  id: string;
  dimension?: number;
  values?: number[];
  confidence?: number;
  semantic_domain?: string;
  sections?: Record<string, unknown>;
  nodes?: Array<Record<string, unknown>>;
  edges?: Array<Record<string, unknown>>;
}

export interface IdeogramMetrics {
  error: number;
  stability: number;
  drift: number;
  semantic_coherence: number;
  consensus_ready: boolean;
}

export interface IdeogramSignature {
  model_pubkey: string;
  hash: string;
  signed_at: string;
}

export interface SerializedIdeogram {
  sbl_version: string;
  ideogram_id: string;
  model_id: string;
  paper_id: string;
  timestamp: string;
  content_manifest: ContentManifestItem[];
  operations_applied: Array<{ op_id: string; param?: Record<string, unknown>; applied_at: string }>;
  metrics: IdeogramMetrics;
  signature?: IdeogramSignature;
}

export class Ideogram {
  readonly sbl_version = '0.2';
  readonly ideogram_id: string;
  readonly model_id: string;
  readonly paper_id: string;
  readonly timestamp: Date;

  content_manifest: ContentManifestItem[] = [];
  operations_applied: Array<{ op_id: string; param?: Record<string, unknown>; applied_at: Date }> = [];
  metrics: IdeogramMetrics = {
    error: 0,
    stability: 1,
    drift: 0,
    semantic_coherence: 1,
    consensus_ready: false
  };
  signature?: IdeogramSignature;

  constructor(modelId: string, paperId: string) {
    this.ideogram_id = uuidv4();
    this.model_id = modelId;
    this.paper_id = paperId;
    this.timestamp = new Date();
  }

  addSemanticVector(values: number[], confidence: number, semanticDomain = 'academic_review'): this {
    this.content_manifest.push({
      type: 'semantic_vector',
      id: 'main_assessment',
      values,
      confidence,
      dimension: values.length,
      semantic_domain: semanticDomain
    });

    return this;
  }

  addStructuredCritique(sections: Record<string, unknown>): this {
    this.content_manifest.push({
      type: 'structured_critique',
      id: 'main_critique',
      sections
    });

    return this;
  }

  recordOperation(opId: string, param?: Record<string, unknown>): this {
    this.operations_applied.push({ op_id: opId, param, applied_at: new Date() });
    return this;
  }

  setMetrics(error: number, stability: number, drift: number): this {
    const boundedError = Math.max(0, Math.min(1, error));
    const boundedStability = Math.max(0, Math.min(1, stability));
    const boundedDrift = Math.max(0, Math.min(1, drift));

    this.metrics = {
      error: boundedError,
      stability: boundedStability,
      drift: boundedDrift,
      semantic_coherence: 1 - (boundedError + boundedDrift) / 2,
      consensus_ready: boundedError < 0.2 && boundedStability > 0.85
    };

    return this;
  }

  sign(modelPubkey: string): this {
    const payload = JSON.stringify({
      ideogram_id: this.ideogram_id,
      model_id: this.model_id,
      paper_id: this.paper_id,
      timestamp: this.timestamp.toISOString()
    });

    this.signature = {
      model_pubkey: modelPubkey,
      hash: createHash('sha256').update(payload).digest('hex'),
      signed_at: new Date().toISOString()
    };

    return this;
  }

  toJSON(): SerializedIdeogram {
    return {
      sbl_version: this.sbl_version,
      ideogram_id: this.ideogram_id,
      model_id: this.model_id,
      paper_id: this.paper_id,
      timestamp: this.timestamp.toISOString(),
      content_manifest: this.content_manifest,
      operations_applied: this.operations_applied.map(op => ({
        ...op,
        applied_at: op.applied_at.toISOString()
      })),
      metrics: this.metrics,
      signature: this.signature
    };
  }
}
