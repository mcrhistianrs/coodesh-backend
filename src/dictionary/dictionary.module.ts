import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
    ]),
  ],
  controllers: [DictionaryController],
  providers: [
    DictionaryDao,
    DictionaryMapper,
    FindAllUseCase,
    FindByWordUseCase,
  ],
  exports: [DictionaryDao, DictionaryMapper, FindAllUseCase, FindByWordUseCase],
})
export class DictionaryModule {}
