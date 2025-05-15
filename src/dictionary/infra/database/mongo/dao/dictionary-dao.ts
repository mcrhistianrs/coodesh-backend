import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DictionaryFindAllDTO } from 'src/dictionary/app/dto/dictionary-find-all-dto';
import { DictionaryFindByWordDTO } from 'src/dictionary/app/dto/dictionary-find-by-word-dto';
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

  async findAll(input: DictionaryFindAllDTO): Promise<Dictionary[]> {
    const { search } = input;
    const query = {};
    if (search) {
      query['word'] = { $regex: search, $options: 'i' };
    }
    const dictionaries = await this.dictionaryMongoSchema.find(query);
    return dictionaries.map(DictionaryMapper.toDomain);
  }

  async findByWord(input: DictionaryFindByWordDTO): Promise<Dictionary | null> {
    const { word } = input;
    const dictionary = await this.dictionaryMongoSchema.findOne({
      word: { $regex: `^${word}$`, $options: 'i' },
    });

    if (!dictionary) {
      return null;
    }

    return DictionaryMapper.toDomain(dictionary);
  }

  async count(input: DictionaryFindAllDTO): Promise<number> {
    const { search } = input;
    const query = {};
    if (search) {
      query['word'] = { $regex: search, $options: 'i' };
    }
    return this.dictionaryMongoSchema.countDocuments(query);
  }

  async findById(id: string): Promise<Dictionary | null> {
    const dictionary = await this.dictionaryMongoSchema.findById(id);
    if (!dictionary) {
      return null;
    }
  }
}

export { DictionaryDao };
