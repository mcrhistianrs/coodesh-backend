import {
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/app/guards/jwt-auth.guard';
import { SwaggerAddFavoriteResponse } from './app/swagger/swagger-add-favorite-response';
import { SwaggerListFavoritesResponse } from './app/swagger/swagger-list-favorites-response';
import { SwaggerRemoveFavoriteResponse } from './app/swagger/swagger-remove-favorite-response';
import { FavoriteRepository } from './infra/database/mongo/repository/favorite-repository';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @SwaggerListFavoritesResponse()
  async listFavorites(@Headers('authorization') authorization: string) {
    try {
      const token = authorization.split(' ')[1];
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id || decodedToken.sub;
      return this.favoriteRepository.findAll(userId);
    } catch (error) {
      return { error: 'Token processing error', message: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:word')
  @SwaggerAddFavoriteResponse()
  async addFavorite(
    @Param('word') word: string,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const token = authorization.split(' ')[1];
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id || decodedToken.sub;
      const favorite = await this.favoriteRepository.updateFavorite(
        userId,
        word,
      );

      if (!favorite) {
        return {
          success: false,
          message: `Word "${word}" not found in dictionary`,
        };
      }

      return {
        success: true,
        message: `Added "${word}" to favorites`,
        favorite,
      };
    } catch (error) {
      return { error: 'Token processing error', message: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:word/remove')
  @SwaggerRemoveFavoriteResponse()
  async removeFavorite(
    @Param('word') word: string,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const token = authorization.split(' ')[1];
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id || decodedToken.sub;
      const success = await this.favoriteRepository.removeFavorite(
        userId,
        word,
      );

      if (!success) {
        return {
          success: false,
          message: `Word "${word}" not found in favorites or could not be removed`,
        };
      }

      return {
        success: true,
        message: `Removed "${word}" from favorites`,
      };
    } catch (error) {
      return { error: 'Token processing error', message: error.message };
    }
  }
}
