import { Types } from 'mongoose';

interface DictionaryFields {
  _id?: string;
  word: string;
}

class Dictionary {
  private fields: DictionaryFields;

  constructor(fields: DictionaryFields, id?: string) {
    this.fields = {
      ...fields,
      _id: id || fields._id || new Types.ObjectId().toString(),
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
}

export { Dictionary };
