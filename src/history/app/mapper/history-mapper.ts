import { Types } from 'mongoose';
import { History } from '../../domain/entities/history';
import { HistoryMongoDocument } from '../../infra/database/mongo/schemas/history';
import { HistoryOutput } from '../dto/history-output';

class HistoryMapper {
  static toOutput(input: History): HistoryOutput {
    return {
      id: input.id,
      userId: input.userId,
      dictionaryId: input.dictionaryId,
      createdAt: input.createdAt,
    };
  }

  static toDomain(input: HistoryMongoDocument): History {
    return History.create({
      userId: input.userId,
      dictionaryId: input.dictionaryId,
      visited: input.visited,
      createdAt: input.createdAt,
    });
  }

  static toDatabase(input: History): HistoryMongoDocument {
    const id = input.id ? new Types.ObjectId(input.id) : new Types.ObjectId();
    return {
      _id: id,
      userId: input.userId,
      dictionaryId: input.dictionaryId,
      visited: input.visited,
      createdAt: input.createdAt,
    };
  }
}

export { HistoryMapper };
