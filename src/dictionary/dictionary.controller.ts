import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/app/guards/jwt-auth.guard';
import { DictionaryFindAllDTO } from './app/dto/dictionary-find-all-dto';
import { DictionaryMapper } from './app/mapper/dictionary-mapper';
import { FindAllUseCase } from './app/use-cases/find-all-use-case';
import { FindByWordUseCase } from './app/use-cases/find-by-word-use-case';
import { Dictionary } from './domain/entities/dictionary';
import { DictionaryDao } from './infra/database/mongo/dao/dictionary-dao';

@Controller('dictionary')
export class DictionaryController {
  constructor(
    private readonly dictionaryDAO: DictionaryDao,
    private readonly findAllUseCase: FindAllUseCase,
    private readonly findByWordUseCase: FindByWordUseCase,
  ) {}

  @Post()
  async create(@Body() input: { word: string }) {
    const dictionary = Dictionary.create({ word: input.word });
    const createdDictionary = await this.dictionaryDAO.create(dictionary);
    return DictionaryMapper.toOutput(createdDictionary);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/entries/en/:word')
  async findByWord(
    @Param('word') word: string,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const token = authorization.split(' ')[1];
      return this.findByWordUseCase.execute(token, word);
    } catch (error) {
      return { error: 'Token processing error', message: error.message };
    }
  }

  @Get('/entries/en')
  async findAll(@Query() query: DictionaryFindAllDTO) {
    return this.findAllUseCase.execute(query);
  }
}
