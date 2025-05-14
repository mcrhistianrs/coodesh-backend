import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DictionaryMongoModel } from 'src/dictionary/infra/database/mongo/schemas/dictionary';
import { HistoryMapper } from 'src/history/app/mapper/history-mapper';
import { History } from 'src/history/domain/entities/history';
import { HistoryMongoModel } from '../schemas/history';

@Injectable()
class HistoryRepository {
  constructor(
    @InjectModel(HistoryMongoModel.name)
    private readonly historyMongoSchema: Model<HistoryMongoModel>,
    @InjectModel(DictionaryMongoModel.name)
    private readonly dictionaryMongoSchema: Model<DictionaryMongoModel>,
  ) {}

  async updateVisited(userId: string, word: string): Promise<History | null> {
    const dictionary = await this.dictionaryMongoSchema.findOne({
      word,
    });
    if (!dictionary) {
      return null;
    }
    const history = await this.historyMongoSchema.findOne({
      userId,
      dictionaryId: dictionary.id,
    });
    if (!history) {
      const newHistory = History.create({
        userId,
        dictionaryId: dictionary.id,
        visited: true,
      });
      return HistoryMapper.toDomain(
        await this.historyMongoSchema.create(
          HistoryMapper.toDatabase(newHistory),
        ),
      );
    } else {
      history.visited = true;
      return HistoryMapper.toDomain(
        await this.historyMongoSchema.findByIdAndUpdate(history.id, {
          visited: true,
        }),
      );
    }
  }
}
export { HistoryRepository };
