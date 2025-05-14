import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryController } from './history.controller';
import { HistoryDao } from './infra/database/mongo/dao/history-dao';
import {
  HistoryMongoModel,
  HistoryMongoSchema,
} from './infra/database/mongo/schemas/history';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistoryMongoModel.name, schema: HistoryMongoSchema },
    ]),
  ],
  controllers: [HistoryController],
  providers: [HistoryDao],
  exports: [HistoryDao],
})
export class HistoryModule {}
