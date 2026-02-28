import { Ideogram } from '../sbl/ideogram';
import { ReputationEngine, ReviewOutcome } from '../sbl/reputation';
import { SBLNeutralSpace } from '../sbl/neutralSpace';
import { SBLModelReputation, SBLIdeogram } from '../models/SBL';

interface CreateIdeogramInput {
  model_id: string;
  paper_id: string;
  semantic_vector: number[];
  confidence?: number;
  critique?: Record<string, unknown>;
}

const DEFAULT_RECOMMENDATION = 'REVIEW_REQUIRED';

export class SBLService {
  private neutralSpace = new SBLNeutralSpace();
  private reputationEngine = new ReputationEngine();

  async createIdeogram(input: CreateIdeogramInput) {
    const ideogram = new Ideogram(input.model_id, input.paper_id)
      .addSemanticVector(input.semantic_vector, input.confidence ?? 0.8)
      .setMetrics(0.1, 0.9, 0.02)
      .recordOperation('sbl.op.academic.grade_rubric', { rubric: 'base_v1' })
      .sign(input.model_id);

    if (input.critique) {
      ideogram.addStructuredCritique(input.critique);
    }

    const payload = ideogram.toJSON();
    await SBLIdeogram.create({
      ...payload,
      timestamp: new Date(payload.timestamp)
    });

    return payload;
  }

  async getModelReputation(modelId: string) {
    const existing = await SBLModelReputation.findOne({ model_id: modelId });
    if (existing) {
      return existing;
    }

    const seed = this.reputationEngine.getInitialReputation(modelId);
    return SBLModelReputation.create(seed);
  }

  async updateModelReputation(modelId: string, outcome: ReviewOutcome, errorMagnitude: number) {
    const current = await this.getModelReputation(modelId);
    const next = this.reputationEngine.update({
      model_id: current.model_id,
      reputation_short: current.reputation_short,
      reputation_long: current.reputation_long,
      review_count: current.review_count,
      successful_reviews: current.successful_reviews,
      penalty_flag: current.penalty_flag,
      rehabilitation_until: current.rehabilitation_until,
      updated_at: current.updated_at
    }, outcome, errorMagnitude);

    current.set(next);
    await current.save();

    return current;
  }

  async compatibility(ideogramAId: string, ideogramBId: string) {
    const [docA, docB] = await Promise.all([
      SBLIdeogram.findOne({ ideogram_id: ideogramAId }),
      SBLIdeogram.findOne({ ideogram_id: ideogramBId })
    ]);

    if (!docA || !docB) {
      throw new Error('Ideogram not found');
    }

    const ideogramA = new Ideogram(docA.model_id, docA.paper_id);
    const vectorA = (docA.content_manifest.find(item => item.type === 'semantic_vector') as { values?: number[] } | undefined)?.values ?? [];
    ideogramA.addSemanticVector(vectorA, 0.8);

    const ideogramB = new Ideogram(docB.model_id, docB.paper_id);
    const vectorB = (docB.content_manifest.find(item => item.type === 'semantic_vector') as { values?: number[] } | undefined)?.values ?? [];
    ideogramB.addSemanticVector(vectorB, 0.8);

    const error = this.neutralSpace.compatibilityError(ideogramA, ideogramB);

    return {
      ideogram_A: docA.model_id,
      ideogram_B: docB.model_id,
      compatibility_error: error,
      compatible: error < 0.2,
      consensus_likely: error < 0.15
    };
  }

  async consensus(paperId: string) {
    const ideograms = await SBLIdeogram.find({ paper_id: paperId }).lean();

    const recommendations = ideograms.map(ideogram => {
      const critique = ideogram.content_manifest.find(item => item.type === 'structured_critique');
      if (!critique || !('sections' in critique) || typeof critique.sections !== 'object' || critique.sections === null) {
        return DEFAULT_RECOMMENDATION;
      }

      const recommendation = (critique.sections as Record<string, unknown>).overall_recommendation;
      return typeof recommendation === 'string' ? recommendation : DEFAULT_RECOMMENDATION;
    });

    const result = this.reputationEngine.reachConsensus(recommendations);

    return {
      paper_id: paperId,
      ...result,
      models_participating: ideograms.map(item => item.model_id)
    };
  }
}
