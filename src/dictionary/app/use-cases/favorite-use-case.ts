import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DictionaryDao } from 'src/dictionary/infra/database/mongo/dao/dictionary-dao';
import { FavoriteRepository } from 'src/favorite/infra/database/mongo/repository/favorite-repository';

@Injectable()
class FavoriteUseCase {
  private secretKey: string;

  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly dictionaryDao: DictionaryDao,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('JWT_SECRET');
  }

  async favorite(token: string, word: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.secretKey,
      });
      const userId = decodedToken.id || decodedToken.sub;

      const dictionary = await this.dictionaryDao.findByWord({ word });
      if (!dictionary) {
        return {
          success: false,
          message: `Word "${word}" not found in dictionary`,
        };
      }

      const favorite = await this.favoriteRepository.updateFavorite(
        userId,
        word,
      );

      if (!favorite) {
        return {
          success: false,
          message: 'Could not add word to favorites',
        };
      }

      return {
        success: true,
        message: `Added "${word}" to favorites`,
        favorite,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error processing favorite request',
        error: error.message,
      };
    }
  }

  async unfavorite(token: string, word: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.secretKey,
      });
      const userId = decodedToken.id || decodedToken.sub;

      const dictionary = await this.dictionaryDao.findByWord({ word });
      if (!dictionary) {
        return {
          success: false,
          message: `Word "${word}" not found in dictionary`,
        };
      }

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
      return {
        success: false,
        message: 'Error processing unfavorite request',
        error: error.message,
      };
    }
  }
}

export { FavoriteUseCase };
