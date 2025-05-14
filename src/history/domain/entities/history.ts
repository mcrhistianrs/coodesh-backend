import { Types } from 'mongoose';

interface HistoryFields {
  _id?: string;
  userId: string;
  dictionaryId: string;
  visited?: boolean;
  createdAt?: Date;
}

class History {
  private fields: HistoryFields;

  constructor(fields: HistoryFields, id?: string) {
    this.fields = {
      ...fields,
      _id: id || fields._id || new Types.ObjectId().toString(),
    };
  }

  static create(fields: HistoryFields, id?: string) {
    return new History(fields, id);
  }

  get id(): string {
    return this.fields._id;
  }

  get userId(): string {
    return this.fields.userId;
  }

  get dictionaryId(): string {
    return this.fields.dictionaryId;
  }

  set dictionaryId(dictionaryId: string) {
    this.fields.dictionaryId = dictionaryId;
  }

  get visited(): boolean {
    return this.fields.visited;
  }

  set visited(visited: boolean) {
    this.fields.visited = visited;
  }

  get createdAt(): Date {
    return this.fields.createdAt;
  }
}

export { History };
