import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HistoryRepository } from 'src/history/infra/database/mongo/repository/history-repository';

@Injectable()
class FindByWordUseCase {
  private secretKey: string;

  constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('JWT_SECRET');
  }

  async execute(token: string, word: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.secretKey,
      });
      const userId = decoded.id || decoded.sub;

      const history = await this.historyRepository.updateVisited(userId, word);
      if (!history) {
        return null;
      }
      return {
        id: history.dictionaryId,
      };
    } catch {
      throw new BadRequestException('Error processing find by word request');
    }
  }
}

export { FindByWordUseCase };
