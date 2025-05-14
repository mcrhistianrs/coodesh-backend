import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DictionaryMongoModel,
  DictionaryMongoSchema,
} from 'src/dictionary/infra/database/mongo/schemas/dictionary';
import { HistoryController } from './history.controller';
import { HistoryRepository } from './infra/database/mongo/repository/history-repository';
import {
  HistoryMongoModel,
  HistoryMongoSchema,
} from './infra/database/mongo/schemas/history';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistoryMongoModel.name, schema: HistoryMongoSchema },
      { name: DictionaryMongoModel.name, schema: DictionaryMongoSchema },
    ]),
  ],
  controllers: [HistoryController],
  providers: [HistoryRepository],
  exports: [HistoryRepository],
})
export class HistoryModule {}
