import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DictionaryMongoModel } from 'src/dictionary/infra/database/mongo/schemas/dictionary';
import { FavoriteMapper } from 'src/favorite/app/mapper/favorite-mapper';
import { Favorite } from 'src/favorite/domain/entities/favorite';
import { FavoriteMongoModel } from '../schemas/favorite';

@Injectable()
class FavoriteRepository {
  constructor(
    @InjectModel(FavoriteMongoModel.name)
    private readonly favoriteMongoSchema: Model<FavoriteMongoModel>,
    @InjectModel(DictionaryMongoModel.name)
    private readonly dictionaryMongoSchema: Model<DictionaryMongoModel>,
  ) {}

  async updateVisited(userId: string, word: string): Promise<Favorite | null> {
    const dictionary = await this.dictionaryMongoSchema.findOne({
      word,
    });
    if (!dictionary) {
      return null;
    }
    const favorite = await this.favoriteMongoSchema.findOne({
      userId,
      dictionaryId: dictionary.id,
    });
    if (!favorite) {
      const newFavorite = Favorite.create({
        userId,
        dictionaryId: dictionary.id,
        visited: true,
      });
      return FavoriteMapper.toDomain(
        await this.favoriteMongoSchema.create(
          FavoriteMapper.toDatabase(newFavorite),
        ),
      );
    } else {
      favorite.visited = true;
      return FavoriteMapper.toDomain(
        await this.favoriteMongoSchema.findByIdAndUpdate(favorite.id, {
          visited: true,
        }),
      );
    }
  }

  async findAll(userId: string): Promise<any[]> {
    const favorites = await this.favoriteMongoSchema
      .find({ userId })
      .sort({ createdAt: -1 });

    const favoritesWithWords = await Promise.all(
      favorites.map(async (favorite) => {
        const dictionary = await this.dictionaryMongoSchema.findById(
          favorite.dictionaryId,
        );
        return {
          word: dictionary ? dictionary.word : 'Unknown',
          added: favorite.createdAt,
        };
      }),
    );

    return favoritesWithWords;
  }
}
export { FavoriteRepository };
