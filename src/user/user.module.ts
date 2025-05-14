import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryModule } from 'src/history/history.module';
import { HashModule } from '../hash/hash.module';
import { CreateUserUseCase } from './app/use-cases/create-user-use-case';
import { HistoryUseCase } from './app/use-cases/history-use-case';
import { ListUsersUseCase } from './app/use-cases/list-users-use-case';
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
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    ListUsersUseCase,
    HistoryUseCase,
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
