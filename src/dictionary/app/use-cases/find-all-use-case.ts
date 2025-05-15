import { BadRequestException, Injectable } from '@nestjs/common';
import { DictionaryDao } from 'src/dictionary/infra/database/mongo/dao/dictionary-dao';
import { DictionaryFindAllDTO } from '../dto/dictionary-find-all-dto';
import { DictionaryOutputPaginated } from '../dto/dictionary-paginated-output';

@Injectable()
class FindAllUseCase {
  constructor(private readonly dictionaryDAO: DictionaryDao) {}

  async execute(
    input?: DictionaryFindAllDTO,
  ): Promise<DictionaryOutputPaginated> {
    try {
      const queryParams = {
        search: input?.search,
        limit: input?.limit || '10',
        page: input?.page || '1',
      };

      const limitNumber = Number(queryParams.limit);
      const pageNumber = Number(queryParams.page);

      const [allDictionaries, totalCount] = await Promise.all([
        this.dictionaryDAO.findAll(queryParams),
        this.dictionaryDAO.count(queryParams),
      ]);

      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = startIndex + limitNumber;
      const paginatedDictionaries = allDictionaries.slice(startIndex, endIndex);

      const results = paginatedDictionaries
        .map((dictionary) => dictionary.word)
        .slice(0, limitNumber);

      const totalPages = Math.ceil(totalCount / limitNumber);

      return {
        results,
        totalDocs: totalCount,
        page: pageNumber,
        totalPages: Math.floor(totalPages),
        hasNext: pageNumber < totalPages,
        hasPrev: pageNumber > 1,
      };
    } catch {
      throw new BadRequestException('Error processing find all request');
    }
  }
}

export { FindAllUseCase };
