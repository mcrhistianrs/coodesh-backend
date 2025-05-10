import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DictionaryMapper } from '../../../../app/mapper/dictionary-mapper';
import { Dictionary } from '../../../../domain/entities/dictionary';
import { DictionaryMongoModel } from '../schemas/dictionary';

@Injectable()
class DictionaryDao {
  constructor(
    @InjectModel(DictionaryMongoModel.name)
    private readonly dictionaryMongoSchema: Model<DictionaryMongoModel>,
  ) {}

  async create(input: Dictionary): Promise<Dictionary> {
    const dictionary = await this.dictionaryMongoSchema.create(
      DictionaryMapper.toDatabase(input),
    );
    return DictionaryMapper.toDomain(dictionary);
  }
}

export { DictionaryDao };
