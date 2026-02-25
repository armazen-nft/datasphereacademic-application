import { IPaperDocument } from '../models/Paper';
import { PaperDTO } from '../types/paper.types';

export class PaperMapper {
  static toDTO(doc: IPaperDocument): PaperDTO {
    return {
      id: doc._id.toString(),
      title: doc.title,
      abstract: doc.abstract,
      authors: doc.authors || [],
      status: doc.status,
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString() || new Date().toISOString()
    };
  }

  static toDTOArray(docs: IPaperDocument[]): PaperDTO[] {
    return docs.map((doc) => this.toDTO(doc));
  }
}

export const paperMapper = new PaperMapper();
