import { Types } from 'mongoose';
import { Dictionary } from '../../domain/entities/dictionary';
import { DictionaryMongoDocument } from '../../infra/database/mongo/schemas/dictionary';
import { DictionaryOutput } from '../dto/dictionary-output';
import { DictionaryOutputPaginated } from '../dto/dictionary-paginated-output';
class DictionaryMapper {
  static toOutput(input: Dictionary): DictionaryOutput {
    return {
      id: input.id,
      word: input.word,
    };
  }
  static toOutputPaginated(
    input: Dictionary[],
    limit: number,
  ): DictionaryOutputPaginated {
    return {
      results: input.map((dictionary) => dictionary.word),
      totalDocs: input.length,
      page: 1,
      totalPages: input.length / Number(limit),
      hasNext: input.length > Number(limit),
      hasPrev: false,
    };
  }
  static toDomain(input: DictionaryMongoDocument): Dictionary {
    return Dictionary.create({
      word: input.word,
    });
  }
  static toDatabase(input: Dictionary): DictionaryMongoDocument {
    const id = input.id ? new Types.ObjectId(input.id) : new Types.ObjectId();
    return {
      _id: id,
      word: input.word,
      visited: input.visited,
    };
  }
}
export { DictionaryMapper };
