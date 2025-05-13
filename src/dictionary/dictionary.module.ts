import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DictionaryMapper } from './app/mapper/dictionary-mapper';
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
  controllers: [],
  providers: [DictionaryDao, DictionaryMapper],
  exports: [DictionaryDao, DictionaryMapper],
})
export class DictionaryModule {}
