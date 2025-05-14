import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryModule } from 'src/history/history.module';
import { HistoryRepository } from 'src/history/infra/database/mongo/repository/history-repository';
import {
  HistoryMongoModel,
  HistoryMongoSchema,
} from 'src/history/infra/database/mongo/schemas/history';
import { DictionaryMapper } from './app/mapper/dictionary-mapper';
import { FindAllUseCase } from './app/use-cases/find-all-use-case';
import { FindByWordUseCase } from './app/use-cases/find-by-word-use-case';
import { DictionaryController } from './dictionary.controller';
import { DictionaryDao } from './infra/database/mongo/dao/dictionary-dao';
import {
  DictionaryMongoModel,
  DictionaryMongoSchema,
} from './infra/database/mongo/schemas/dictionary';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DictionaryMongoModel.name, schema: DictionaryMongoSchema },
      { name: HistoryMongoModel.name, schema: HistoryMongoSchema },
    ]),
    forwardRef(() => HistoryModule),
  ],
  controllers: [DictionaryController],
  providers: [
    DictionaryDao,
    DictionaryMapper,
    HistoryRepository,
    FindAllUseCase,
    FindByWordUseCase,
    JwtService,
    ConfigService,
  ],
  exports: [DictionaryDao, DictionaryMapper, FindAllUseCase, FindByWordUseCase],
})
export class DictionaryModule {}
