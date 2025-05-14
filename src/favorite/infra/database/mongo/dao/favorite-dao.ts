import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FavoriteMapper } from 'src/favorite/app/mapper/favorite-mapper';
import { Favorite } from 'src/favorite/domain/entities/favorite';
import { FavoriteMongoModel } from '../schemas/favorite';

@Injectable()
class FavoriteDao {
  constructor(
    @InjectModel(FavoriteMongoModel.name)
    private readonly favoriteMongoSchema: Model<FavoriteMongoModel>,
  ) {}

  async create(input: Favorite): Promise<Favorite> {
    const favorite = await this.favoriteMongoSchema.create(
      FavoriteMapper.toDatabase(input),
    );
    return FavoriteMapper.toDomain(favorite);
  }

  async findAll(userId: string): Promise<Favorite[]> {
    const favorites = await this.favoriteMongoSchema
      .find({ userId })
      .sort({ createdAt: -1 });
    return favorites.map(FavoriteMapper.toDomain);
  }

  async findById(id: string): Promise<Favorite | null> {
    const favorite = await this.favoriteMongoSchema.findById(id);

    if (!favorite) {
      return null;
    }

    return FavoriteMapper.toDomain(favorite);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.favoriteMongoSchema.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async deleteAll(userId: string): Promise<boolean> {
    const result = await this.favoriteMongoSchema.deleteMany({ userId });
    return result.deletedCount > 0;
  }

  async count(userId: string): Promise<number> {
    return this.favoriteMongoSchema.countDocuments({ userId });
  }
}

export { FavoriteDao };
