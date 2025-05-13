import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HashModule } from '../hash/hash.module';
import { CreateUserUseCase } from './app/use-cases/create-user-use-case';
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
  ],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    ListUsersUseCase,
    {
      provide: 'IUserDAO',
      useClass: UserMongoDAO,
    },
  ],
  exports: ['IUserDAO', CreateUserUseCase],
})
export class UserModule {}
