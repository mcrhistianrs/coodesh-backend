import { BadRequestException, Injectable } from '@nestjs/common';
import { DictionaryDao } from 'src/dictionary/infra/database/mongo/dao/dictionary-dao';
import { FreeDictionaryServices } from 'src/free-dictionary/services/free-dictionary.services';
import { DictionaryFindAllDTO } from '../dto/dictionary-find-all-dto';
import { DictionaryOutputPaginated } from '../dto/dictionary-paginated-output';

@Injectable()
class FindAllUseCase {
  constructor(
    private readonly dictionaryDAO: DictionaryDao,
    private readonly freeDictionaryServices: FreeDictionaryServices,
  ) {}

  async execute(
    input?: DictionaryFindAllDTO,
  ): Promise<DictionaryOutputPaginated> {
    try {
      const freeDictionaryInformation =
        await this.freeDictionaryServices.getInformation(input?.search);
      const queryParams = {
        search: input?.search,
        limit: input?.limit || '10',
        page: input?.page || '1',
      };

      const limitNumber = Number(queryParams.limit);
      const pageNumber = Number(queryParams.page);

      const totalCount = await this.dictionaryDAO.count(queryParams);
      const totalPages = Math.ceil(totalCount / limitNumber);

      return {
        results: freeDictionaryInformation,
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
