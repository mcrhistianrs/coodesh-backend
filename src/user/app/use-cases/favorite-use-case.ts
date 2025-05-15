import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FavoriteRepository } from 'src/favorite/infra/database/mongo/repository/favorite-repository';

import { FavoriteOutputPaginated } from '../dto/favorite-paginated.dto';
import { FavoriteDto } from '../dto/favorite.dto';

@Injectable()
class FavoriteUseCase {
  private secretKey: string;

  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('JWT_SECRET');
  }

  async execute(
    input: FavoriteDto & { page?: string; limit?: string },
  ): Promise<FavoriteOutputPaginated> {
    try {
      const { token, page = '1', limit = '10' } = input;

      const decodedToken = this.jwtService.verify(token, {
        secret: this.secretKey,
      });
      const userId = decodedToken.id || decodedToken.sub;

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const allFavoriteItems = await this.favoriteRepository.findAll(userId);
      const totalCount = allFavoriteItems.length;

      const totalPages = Math.ceil(totalCount / limitNumber);
      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = Math.min(startIndex + limitNumber, totalCount);

      const paginatedItems = allFavoriteItems.slice(startIndex, endIndex);

      return {
        results: paginatedItems,
        totalDocs: totalCount,
        page: pageNumber,
        totalPages,
        hasNext: pageNumber < totalPages,
        hasPrev: pageNumber > 1,
      };
    } catch {
      throw new BadRequestException('Error processing favorites request');
    }
  }
}

export { FavoriteUseCase };
