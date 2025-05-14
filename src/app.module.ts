import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { HistoryModule } from './history/history.module';
import { MongoModule } from './shared/infra/database/mongo/mongo.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule,
    DictionaryModule,
    AuthModule,
    UserModule,
    HistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
