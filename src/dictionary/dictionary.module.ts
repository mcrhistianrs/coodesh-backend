import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { FavoriteRepository } from 'src/favorite/infra/database/mongo/repository/favorite-repository';
import {
  FavoriteMongoModel,
  FavoriteSchema,
} from 'src/favorite/infra/database/mongo/schemas/favorite';
import { HistoryModule } from 'src/history/history.module';
import { HistoryRepository } from 'src/history/infra/database/mongo/repository/history-repository';
import {
  HistoryMongoModel,
  HistoryMongoSchema,
} from 'src/history/infra/database/mongo/schemas/history';
import { DictionaryMapper } from './app/mapper/dictionary-mapper';
import { FavoriteUseCase } from './app/use-cases/favorite-use-case';
import { FindAllUseCase } from './app/use-cases/find-all-use-case';
import { FindByWordUseCase } from './app/use-cases/find-by-word-use-case';
import { UnfavoriteUseCase } from './app/use-cases/unfavorite-use-case';
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
      { name: FavoriteMongoModel.name, schema: FavoriteSchema },
    ]),
    forwardRef(() => HistoryModule),
    forwardRef(() => FavoriteModule),
  ],
  controllers: [DictionaryController],
  providers: [
    DictionaryDao,
    DictionaryMapper,
    HistoryRepository,
    FavoriteRepository,
    FindAllUseCase,
    FindByWordUseCase,
    FavoriteUseCase,
    UnfavoriteUseCase,
    JwtService,
    ConfigService,
  ],
  exports: [
    DictionaryDao,
    DictionaryMapper,
    FindAllUseCase,
    FindByWordUseCase,
    FavoriteUseCase,
  ],
})
export class DictionaryModule {}
