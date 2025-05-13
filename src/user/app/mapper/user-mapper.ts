import { Types } from 'mongoose';
import { User } from '../../domain/entities/user';
import { UserMongoDocument } from '../../infra/database/mongo/schemas/user';

class UserMapper {
  static toDomain(input: UserMongoDocument): User {
    return User.create(
      {
        email: input.email,
        password: input.password,
        name: input.name,
      },
      input._id.toString(),
    );
  }

  static toDatabase(input: User): UserMongoDocument {
    return {
      _id: input.id ? new Types.ObjectId(input.id) : new Types.ObjectId(),
      email: input.email,
      password: input.password,
      name: input.name,
    };
  }
}

export { UserMapper };
