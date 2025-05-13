import { Injectable } from '@nestjs/common';
import { DictionaryDao } from 'src/dictionary/infra/database/mongo/dao/dictionary-dao';
import { DictionaryOutput } from '../dto/dictionary-output';

@Injectable()
class FindByWordUseCase {
  constructor(private readonly dictionaryDAO: DictionaryDao) {}

  async execute(word: string): Promise<DictionaryOutput | null> {
    if (!word) {
      return null;
    }

    const dictionary = await this.dictionaryDAO.findByWord({ word });

    if (!dictionary) {
      return null;
    }
    await this.dictionaryDAO.updateVisited(word);
    return {
      id: dictionary.id,
      word: dictionary.word,
    };
  }
}

export { FindByWordUseCase };
