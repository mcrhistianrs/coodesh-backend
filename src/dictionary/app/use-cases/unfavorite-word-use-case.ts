import { Injectable } from '@nestjs/common';
import { DictionaryDao } from 'src/dictionary/infra/database/mongo/dao/dictionary-dao';
import { DictionaryOutput } from '../dto/dictionary-output';

@Injectable()
class UnfavoriteWordUseCase {
  constructor(private readonly dictionaryDAO: DictionaryDao) {}

  async execute(word: string): Promise<DictionaryOutput | null> {
    if (!word) {
      return null;
    }

    const dictionary = await this.dictionaryDAO.updateUnfavorite(word);

    if (!dictionary) {
      return null;
    }

    return {
      id: dictionary.id,
      word: dictionary.word,
      favorite: dictionary.favorite,
      visited: dictionary.visited,
    };
  }
}

export { UnfavoriteWordUseCase };
