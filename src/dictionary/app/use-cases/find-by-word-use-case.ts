import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FreeDictionaryServices } from 'src/free-dictionary/services/free-dictionary.services';
import { HistoryRepository } from 'src/history/infra/database/mongo/repository/history-repository';
import { DictionaryOutputPaginated } from '../dto/dictionary-paginated-output';

@Injectable()
class FindByWordUseCase {
  private secretKey: string;

  constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly freeDictionaryServices: FreeDictionaryServices,
  ) {
    this.secretKey = this.configService.get<string>('JWT_SECRET');
  }

  async execute(
    token: string,
    word: string,
  ): Promise<DictionaryOutputPaginated> {
    try {
      const freeDictionaryInformation =
        await this.freeDictionaryServices.getInformation(word);

      const decoded = this.jwtService.verify(token, {
        secret: this.secretKey,
      });
      const userId = decoded.id || decoded.sub;

      const history = await this.historyRepository.updateVisited(userId, word);
      if (!history) {
        return {
          results: [freeDictionaryInformation],
          totalDocs: 1,
          page: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        };
      }

      return {
        results: [freeDictionaryInformation],
        totalDocs: 1,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };
    } catch {
      throw new BadRequestException('Error processing find by word request');
    }
  }
}

export { FindByWordUseCase };
