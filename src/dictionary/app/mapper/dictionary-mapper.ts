import { Types } from 'mongoose';
import { Dictionary } from '../../domain/entities/dictionary';
import { DictionaryMongoDocument } from '../../infra/database/mongo/schemas/dictionary';
import { DictionaryOutput } from '../dto/dictionary-output';
class DictionaryMapper {
  static toOutput(input: Dictionary): DictionaryOutput {
    return {
      id: input.id,
      word: input.word,
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
    };
  }
}
export { DictionaryMapper };
