import { gzipSync } from 'zlib';
import { SBLArtifact } from '../models/SBLArtifact';
import { SBLReputation } from '../models/SBLReputation';

interface IdeogramInput {
  articleId?: string;
  sourceAgentId: string;
  embedding: number[];
  citationGraph?: string[];
}


export class SBLService {
  async ingestIdeogram(payload: IdeogramInput) {
    const citationGraph = payload.citationGraph ?? [];
    const irreversibility = this.shannonEntropy(payload.embedding);
    const energyEstimate = payload.embedding.length + citationGraph.length;
    const score = energyEstimate > 0 ? Number((1 / (energyEstimate * Math.max(irreversibility, 0.001))).toFixed(6)) : 0;

    const compressedPayload = gzipSync(JSON.stringify(payload)).toString('base64');

    const artifact = await SBLArtifact.create({
      articleId: payload.articleId,
      sourceAgentId: payload.sourceAgentId,
      embedding: payload.embedding,
      citationGraph,
      compressedPayload,
      cte: {
        energyEstimate,
        irreversibility,
        score
      }
    });

    await this.updateReputation(payload.sourceAgentId, score);

    return {
      artifactId: artifact.id,
      cte: artifact.cte,
      compressedBytes: Buffer.from(compressedPayload, 'base64').byteLength
    };
  }

  async getReputation(agentId: string) {
    const reputation = await SBLReputation.findOne({ agentId });

    if (!reputation) {
      return {
        agentId,
        shortTerm: 0,
        longTerm: 0,
        historySize: 0
      };
    }

    return {
      agentId: reputation.agentId,
      shortTerm: reputation.shortTerm,
      longTerm: reputation.longTerm,
      historySize: reputation.history.length,
      updatedAt: reputation.updatedAt
    };
  }

  private async updateReputation(agentId: string, poeScore: number) {
    const reputation = await SBLReputation.findOne({ agentId });
    const history = reputation?.history ?? [];
    history.push(poeScore);

    const boundedHistory = history.slice(-100);
    const shortWindow = boundedHistory.slice(-10);
    const shortTerm = shortWindow.reduce((sum, value) => sum + value, 0) / shortWindow.length;

    const weights = this.fibonacciWeights(boundedHistory.length);
    const weightSum = weights.reduce((sum, value) => sum + value, 0);
    const longTerm = boundedHistory.reduce((sum, value, index) => {
      return sum + value * (weights[index] / weightSum);
    }, 0);

    await SBLReputation.updateOne(
      { agentId },
      {
        $set: {
          shortTerm: Number(shortTerm.toFixed(6)),
          longTerm: Number(longTerm.toFixed(6)),
          updatedAt: new Date()
        },
        $setOnInsert: { agentId },
        $push: { history: { $each: [poeScore], $slice: -100 } }
      },
      { upsert: true }
    );
  }

  private fibonacciWeights(size: number): number[] {
    if (size <= 0) {
      return [];
    }

    const weights = new Array<number>(size).fill(1);
    for (let i = 2; i < size; i++) {
      weights[i] = weights[i - 1] + weights[i - 2];
    }

    return weights;
  }

  private shannonEntropy(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }

    const sum = values.reduce((acc, current) => acc + Math.abs(current), 0);
    if (sum === 0) {
      return 0;
    }

    const entropy = values.reduce((acc, current) => {
      const probability = Math.abs(current) / sum;
      if (probability === 0) {
        return acc;
      }
      return acc - probability * Math.log2(probability);
    }, 0);

    return Number(entropy.toFixed(6));
  }
}
