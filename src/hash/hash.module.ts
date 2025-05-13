import { Module } from '@nestjs/common';
import HashService from './app/services/hash.service';

@Module({
  providers: [HashService, { provide: 'IHashService', useClass: HashService }],
  exports: ['IHashService'],
})
export class HashModule {}
