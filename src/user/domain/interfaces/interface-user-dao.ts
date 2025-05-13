import { UserFindAllDTO } from '../../app/dto/user-find-all';
import { User } from '../entities/user';

interface IUserDAO {
  create(input: User): Promise<User>;
  findAll(filter?: UserFindAllDTO): Promise<User[]>;
  findByEmail(email: string): Promise<User>;
  update(input: User): Promise<User>;
  delete(id: string): Promise<User>;
}

export { IUserDAO };
