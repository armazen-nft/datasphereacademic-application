export abstract class BaseMapper<TDocument, TDTO> {
  abstract toDTO(doc: TDocument): TDTO;

  toDTOArray(docs: TDocument[]): TDTO[] {
    return docs.map((doc) => this.toDTO(doc));
  }
}
