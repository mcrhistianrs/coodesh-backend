import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HistoryRepository } from 'src/history/infra/database/mongo/repository/history-repository';
import { HistoryOutputPaginated } from '../dto/history-paginated.dto';
import { HistoryDto } from '../dto/history.dto';

@Injectable()
class HistoryUseCase {
  private secretKey: string;

  constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('JWT_SECRET');
  }

  async execute(
    input: HistoryDto & { page?: string; limit?: string },
  ): Promise<HistoryOutputPaginated> {
    try {
      const { token, page = '1', limit = '10' } = input;

      const decodedToken = this.jwtService.verify(token, {
        secret: this.secretKey,
      });
      const userId = decodedToken.id || decodedToken.sub;

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const allHistoryItems = await this.historyRepository.findAll(userId);
      const totalCount = allHistoryItems.length;

      const totalPages = Math.ceil(totalCount / limitNumber);
      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = Math.min(startIndex + limitNumber, totalCount);

      const paginatedItems = allHistoryItems.slice(startIndex, endIndex);

      return {
        results: paginatedItems,
        totalDocs: totalCount,
        page: pageNumber,
        totalPages,
        hasNext: pageNumber < totalPages,
        hasPrev: pageNumber > 1,
      };
    } catch {
      throw new BadRequestException('Error processing history request');
    }
  }
}

export { HistoryUseCase };
