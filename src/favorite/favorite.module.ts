import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DictionaryMongoModel,
  DictionaryMongoSchema,
} from 'src/dictionary/infra/database/mongo/schemas/dictionary';
import { FavoriteController } from './favorite.controller';
import { FavoriteRepository } from './infra/database/mongo/repository/favorite-repository';
import {
  FavoriteMongoModel,
  FavoriteSchema,
} from './infra/database/mongo/schemas/favorite';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FavoriteMongoModel.name, schema: FavoriteSchema },
      { name: DictionaryMongoModel.name, schema: DictionaryMongoSchema },
    ]),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteRepository],
  exports: [FavoriteRepository],
})
export class FavoriteModule {}
