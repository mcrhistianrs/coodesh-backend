import { Types } from 'mongoose';

interface DictionaryFields {
  _id?: string;
  word: string;
  favorite?: boolean;
  visited?: boolean;
}

class Dictionary {
  private fields: DictionaryFields;

  constructor(fields: DictionaryFields, id?: string) {
    this.fields = {
      ...fields,
      _id: id || fields._id || new Types.ObjectId().toString(),
      favorite: fields.favorite || false,
      visited: fields.visited || false,
    };
  }

  static create(fields: DictionaryFields, id?: string) {
    return new Dictionary(fields, id);
  }

  get id(): string {
    return this.fields._id;
  }

  get word(): string {
    return this.fields.word;
  }
  set word(word: string) {
    this.fields.word = word;
  }

  get favorite(): boolean {
    return this.fields.favorite;
  }
  set favorite(favorite: boolean) {
    this.fields.favorite = favorite;
  }

  get visited(): boolean {
    return this.fields.visited;
  }
  set visited(visited: boolean) {
    this.fields.visited = visited;
  }
}

export { Dictionary };
