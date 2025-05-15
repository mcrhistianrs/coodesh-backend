import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserFindAllDTO } from '../../../../app/dto/user-find-all';
import { User } from '../../../../domain/entities/user';
import { IUserDAO } from '../../../../domain/interfaces/interface-user-dao';

import { UserMapper } from '../../../../app/mapper/user-mapper';
import { UserMongoModel } from '../schemas/user';

class UserMongoDAO implements IUserDAO {
  constructor(
    @InjectModel(UserMongoModel.name)
    private readonly userMongoSchema: Model<UserMongoModel>,
  ) {}

  async create(input: User): Promise<User> {
    const toDatabase = UserMapper.toDatabase(input);
    const userModel = new this.userMongoSchema(toDatabase);
    const user = await userModel.save();
    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userMongoSchema.findOne({ email }).exec();
    return user ? UserMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userMongoSchema.findById(id).exec();
    return user ? UserMapper.toDomain(user) : null;
  }

  async findAll(filter?: UserFindAllDTO): Promise<User[]> {
    const query: any = {};

    if (filter?.email) {
      query.email = new RegExp(filter.email, 'i');
    }

    const users = await this.userMongoSchema.find(query).exec();
    return users.map((user) => UserMapper.toDomain(user));
  }

  async update(input: User): Promise<User> {
    const toDatabase = UserMapper.toDatabase(input);
    const user = await this.userMongoSchema
      .findByIdAndUpdate(input.id, toDatabase, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with id ${input.id} not found`);
    }

    return UserMapper.toDomain(user);
  }

  async delete(id: string): Promise<User> {
    const user = await this.userMongoSchema.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserMapper.toDomain(user);
  }
}

export { UserMongoDAO };
