import { Ideogram } from './ideogram';

export class SBLNeutralSpace {
  readonly dimension = 512;

  private projectionMatrices = new Map<string, number[][]>();

  registerProjection(modelId: string, matrix: number[][]): void {
    if (matrix.length !== this.dimension) {
      throw new Error('Projection matrix must have 512 rows');
    }

    this.projectionMatrices.set(modelId, matrix);
  }

  encode(embedding: number[], modelId: string): number[] {
    const projection = this.getProjection(modelId, embedding.length);
    const encoded = new Array(this.dimension).fill(0);

    for (let i = 0; i < this.dimension; i += 1) {
      for (let j = 0; j < embedding.length; j += 1) {
        encoded[i] += (projection[i]?.[j] ?? 0) * embedding[j];
      }
    }

    return this.normalize(encoded);
  }

  compatibilityError(ideogramA: Ideogram, ideogramB: Ideogram): number {
    const vecA = ideogramA.content_manifest.find(item => item.type === 'semantic_vector')?.values ?? [];
    const vecB = ideogramB.content_manifest.find(item => item.type === 'semantic_vector')?.values ?? [];

    if (vecA.length === 0 || vecB.length === 0) {
      return 1;
    }

    const encodedA = this.encode(vecA, ideogramA.model_id);
    const encodedB = this.encode(vecB, ideogramB.model_id);

    let sum = 0;
    for (let i = 0; i < this.dimension; i += 1) {
      const diff = encodedA[i] - encodedB[i];
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  }

  private getProjection(modelId: string, sourceDimension: number): number[][] {
    const existing = this.projectionMatrices.get(modelId);
    if (existing) {
      return existing;
    }

    const identity = Array.from({ length: this.dimension }, (_, i) =>
      Array.from({ length: sourceDimension }, (_, j) => (i === j ? 1 : 0))
    );

    this.projectionMatrices.set(modelId, identity);
    return identity;
  }

  private normalize(vector: number[]): number[] {
    const norm = Math.sqrt(vector.reduce((acc, v) => acc + (v * v), 0));
    if (norm === 0) {
      return vector;
    }

    return vector.map(v => v / norm);
  }
}
