import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/app/guards/jwt-auth.guard';
import { DictionaryFindAllDTO } from './app/dto/dictionary-find-all-dto';
import { DictionaryMapper } from './app/mapper/dictionary-mapper';
import { SwaggerCreateDictionaryResponse } from './app/swagger/swagger-create-dictionary-response';
import { SwaggerFavoriteDictionaryResponse } from './app/swagger/swagger-favorite-dictionary-response';
import { SwaggerFindAllResponse } from './app/swagger/swagger-find-all-response';
import { SwaggerFindByWordResponse } from './app/swagger/swagger-find-by-word-response';
import { SwaggerUnfavoriteDictionaryResponse } from './app/swagger/swagger-unfavorite-dictionary-response';
import { FavoriteUseCase } from './app/use-cases/favorite-use-case';
import { FindAllUseCase } from './app/use-cases/find-all-use-case';
import { FindByWordUseCase } from './app/use-cases/find-by-word-use-case';
import { UnfavoriteUseCase } from './app/use-cases/unfavorite-use-case';
import { Dictionary } from './domain/entities/dictionary';
import { DictionaryDao } from './infra/database/mongo/dao/dictionary-dao';

@Controller('dictionary')
export class DictionaryController {
  constructor(
    private readonly dictionaryDAO: DictionaryDao,
    private readonly findAllUseCase: FindAllUseCase,
    private readonly findByWordUseCase: FindByWordUseCase,
    private readonly favoriteUseCase: FavoriteUseCase,
    private readonly unfavoriteUseCase: UnfavoriteUseCase,
  ) {}

  @Post()
  @SwaggerCreateDictionaryResponse()
  async create(@Body() input: { word: string }) {
    const dictionary = Dictionary.create({ word: input.word });
    const createdDictionary = await this.dictionaryDAO.create(dictionary);
    return DictionaryMapper.toOutput(createdDictionary);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/entries/en/:word/favorite')
  @SwaggerFavoriteDictionaryResponse()
  async favoriteWord(
    @Param('word') word: string,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const token = authorization.split(' ')[1];
      return this.favoriteUseCase.favorite(token, word);
    } catch (error) {
      return { error: 'Token processing error', message: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/entries/en/:word')
  @SwaggerFindByWordResponse()
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

  @UseGuards(JwtAuthGuard)
  @Patch('/entries/en/:word/unfavorite')
  @SwaggerUnfavoriteDictionaryResponse()
  async unfavoriteWord(
    @Param('word') word: string,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const token = authorization.split(' ')[1];
      return this.unfavoriteUseCase.execute(token, word);
    } catch (error) {
      return { error: 'Token processing error', message: error.message };
    }
  }

  @Get('/entries/en')
  @SwaggerFindAllResponse()
  async findAll(@Query() query: DictionaryFindAllDTO) {
    return this.findAllUseCase.execute(query);
  }
}
