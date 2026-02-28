export interface ModelReputation {
  model_id: string;
  reputation_short: number;
  reputation_long: number;
  review_count: number;
  successful_reviews: number;
  penalty_flag: boolean;
  rehabilitation_until?: Date;
  updated_at: Date;
}

export type ReviewOutcome = 'success' | 'error' | 'violation';

export class ReputationEngine {
  private readonly lambdaShort = 0.15;
  private readonly lambdaLong = 0.01;

  getInitialReputation(modelId: string): ModelReputation {
    return {
      model_id: modelId,
      reputation_short: 0.5,
      reputation_long: 0.5,
      review_count: 0,
      successful_reviews: 0,
      penalty_flag: false,
      updated_at: new Date()
    };
  }

  update(reputation: ModelReputation, outcome: ReviewOutcome, errorMagnitude: number): ModelReputation {
    let observed = 0.5;
    if (outcome === 'success' && errorMagnitude < 0.15) {
      observed = 0.95 + (0.05 * (1 - errorMagnitude));
    } else if (outcome === 'error') {
      observed = Math.max(0, 0.5 - (0.4 * Math.min(errorMagnitude / 0.5, 1)));
    } else if (outcome === 'violation') {
      observed = 0;
    }

    const next: ModelReputation = {
      ...reputation,
      reputation_short: (1 - this.lambdaShort) * reputation.reputation_short + this.lambdaShort * observed,
      reputation_long: (1 - this.lambdaLong) * reputation.reputation_long + this.lambdaLong * observed,
      review_count: reputation.review_count + 1,
      successful_reviews: reputation.successful_reviews + (outcome === 'success' ? 1 : 0),
      updated_at: new Date()
    };

    if (next.reputation_short < 0.4 && next.review_count > 10) {
      next.penalty_flag = true;
      next.rehabilitation_until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    if (next.penalty_flag && next.reputation_short > 0.7 && next.rehabilitation_until && Date.now() > next.rehabilitation_until.getTime()) {
      next.penalty_flag = false;
    }

    return next;
  }

  reachConsensus(recommendations: string[], threshold = 0.7): { consensus: boolean; agreement_ratio: number; final_recommendation: string } {
    const voteMap = new Map<string, number>();

    recommendations.forEach(recommendation => {
      voteMap.set(recommendation, (voteMap.get(recommendation) ?? 0) + 1);
    });

    if (recommendations.length === 0) {
      return { consensus: false, agreement_ratio: 0, final_recommendation: 'UNDECIDED' };
    }

    const [winner, count] = Array.from(voteMap.entries()).sort((a, b) => b[1] - a[1])[0];
    const agreementRatio = count / recommendations.length;

    return {
      consensus: agreementRatio >= threshold,
      agreement_ratio: agreementRatio,
      final_recommendation: winner
    };
  }
}
