import { Inject, Injectable } from '@nestjs/common';

import HashService from 'src/hash/app/services/hash.service';
import { User } from '../../domain/entities/user';
import { IUserDAO } from '../../domain/interfaces/interface-user-dao';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserOutputDTO } from '../dto/user-output.dto';

@Injectable()
class CreateUserUseCase {
  constructor(
    @Inject('IUserDAO')
    private userDAO: IUserDAO,
    @Inject('IHashService')
    private hashService: HashService,
  ) {}

  async execute(input: CreateUserDTO): Promise<UserOutputDTO> {
    const userInput = User.create({
      email: input.email,
      password: input.password,
      name: input.name,
    });
    const encryptedPassword = await this.hashService.hash(userInput.password);
    userInput.password = encryptedPassword;
    const user = await this.userDAO.create(userInput);
    return new UserOutputDTO(user.id, user.email, user.name);
  }
}

export { CreateUserUseCase };
