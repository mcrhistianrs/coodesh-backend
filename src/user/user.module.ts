import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { DictionaryModule } from 'src/dictionary/dictionary.module';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { HistoryModule } from 'src/history/history.module';
import { HashModule } from '../hash/hash.module';
import { CreateUserUseCase } from './app/use-cases/create-user-use-case';
import { FavoriteUseCase } from './app/use-cases/favorite-use-case';
import { HistoryUseCase } from './app/use-cases/history-use-case';
import { ListUsersUseCase } from './app/use-cases/list-users-use-case';
import { ProfileUseCase } from './app/use-cases/profile-use-case';
import { UserMongoDAO } from './infra/database/mongo/daos/user-mongo-dao';
import {
  UserMongoModel,
  UserMongoSchema,
} from './infra/database/mongo/schemas/user';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserMongoModel.name, schema: UserMongoSchema },
    ]),
    forwardRef(() => HashModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => FavoriteModule),
    forwardRef(() => DictionaryModule),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    ListUsersUseCase,
    HistoryUseCase,
    FavoriteUseCase,
    ProfileUseCase,
    JwtService,
    ConfigService,
    {
      provide: 'IUserDAO',
      useClass: UserMongoDAO,
    },
  ],
  exports: ['IUserDAO', CreateUserUseCase],
})
export class UserModule {}
