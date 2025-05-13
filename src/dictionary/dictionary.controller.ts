import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DictionaryFindAllDTO } from './app/dto/dictionary-find-all-dto';
import { DictionaryMapper } from './app/mapper/dictionary-mapper';
import { FindAllUseCase } from './app/use-cases/find-all-use-case';
import { Dictionary } from './domain/entities/dictionary';
import { DictionaryDao } from './infra/database/mongo/dao/dictionary-dao';

@Controller('dictionary')
export class DictionaryController {
  constructor(
    private readonly dictionaryDAO: DictionaryDao,
    private readonly findAllUseCase: FindAllUseCase,
  ) {}

  @Post()
  async create(@Body() input: { word: string }) {
    const dictionary = Dictionary.create({ word: input.word });
    const createdDictionary = await this.dictionaryDAO.create(dictionary);
    return DictionaryMapper.toOutput(createdDictionary);
  }

  @Get('/entries/en')
  async findAll(@Query() query: DictionaryFindAllDTO) {
    return this.findAllUseCase.execute(query);
  }
}
