import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoryMapper } from 'src/history/app/mapper/history-mapper';
import { History } from 'src/history/domain/entities/history';
import { HistoryMongoModel } from '../schemas/history';

@Injectable()
class HistoryDao {
  constructor(
    @InjectModel(HistoryMongoModel.name)
    private readonly historyMongoSchema: Model<HistoryMongoModel>,
  ) {}

  async create(input: History): Promise<History> {
    const history = await this.historyMongoSchema.create(
      HistoryMapper.toDatabase(input),
    );
    return HistoryMapper.toDomain(history);
  }

  async findAll(userId: string): Promise<History[]> {
    const histories = await this.historyMongoSchema
      .find({ userId })
      .sort({ createdAt: -1 });
    return histories.map(HistoryMapper.toDomain);
  }

  async findById(id: string): Promise<History | null> {
    const history = await this.historyMongoSchema.findById(id);

    if (!history) {
      return null;
    }

    return HistoryMapper.toDomain(history);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.historyMongoSchema.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async deleteAll(userId: string): Promise<boolean> {
    const result = await this.historyMongoSchema.deleteMany({ userId });
    return result.deletedCount > 0;
  }

  async count(userId: string): Promise<number> {
    return this.historyMongoSchema.countDocuments({ userId });
  }
}

export { HistoryDao };
