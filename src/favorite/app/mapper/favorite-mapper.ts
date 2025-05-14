import { Favorite } from 'src/favorite/domain/entities/favorite';
import { FavoriteMongoModel } from 'src/favorite/infra/database/mongo/schemas/favorite';

class FavoriteMapper {
  static toDomain(model: FavoriteMongoModel): Favorite {
    return Favorite.create(
      {
        userId: model.userId,
        dictionaryId: model.dictionaryId,
        visited: model.visited,
        createdAt: model.createdAt,
      },
      model._id.toString(),
    );
  }

  static toDatabase(entity: Favorite): Partial<FavoriteMongoModel> {
    return {
      _id: entity.id,
      userId: entity.userId,
      dictionaryId: entity.dictionaryId,
      visited: entity.visited,
    };
  }
}

export { FavoriteMapper };
