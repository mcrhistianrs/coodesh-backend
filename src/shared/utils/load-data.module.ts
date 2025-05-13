import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DictionaryModule } from '../../dictionary/dictionary.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL_SCRIPT),
    DictionaryModule,
  ],
})
export class LoadDataModule {}
