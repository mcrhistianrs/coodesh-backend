import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserDAO } from '../../domain/interfaces/interface-user-dao';
import { UserOutputDTO } from '../dto/user-output.dto';

@Injectable()
class ListUsersUseCase {
  constructor(
    @Inject('IUserDAO')
    private userDAO: IUserDAO,
  ) {}

  async execute(): Promise<UserOutputDTO[]> {
    try {
      const users = await this.userDAO.findAll();
      return users.map(
        (user) => new UserOutputDTO(user.id, user.email, user.name),
      );
    } catch {
      throw new BadRequestException('Error processing list users request');
    }
  }
}

export { ListUsersUseCase };
