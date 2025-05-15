import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/app/dto/create-user.dto';
import { User } from 'src/user/domain/entities/user';
import { IUserDAO } from 'src/user/domain/interfaces/interface-user-dao';
import { AuthOutputDTO } from '../dto/auth-output-dto';
import { AuthService } from '../services/auth.service';
@Injectable()
class SignupUseCase {
  constructor(
    @Inject('IUserDAO')
    private readonly userMongoDAO: IUserDAO,
    private readonly authService: AuthService,
  ) {}
  async execute(input: CreateUserDTO): Promise<AuthOutputDTO> {
    try {
      const userAlreadyExists = await this.userMongoDAO.findByEmail(
        input.email,
      );
      if (userAlreadyExists) {
        throw new BadRequestException('User already exists');
      }
      const userDomainEntity = User.create(input);
      const userDataBaseEntity =
        await this.userMongoDAO.create(userDomainEntity);
      const token = await this.authService.generateToken(userDataBaseEntity);
      return {
        id: userDataBaseEntity.id,
        name: userDataBaseEntity.name,
        token,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error processing signup request');
    }
  }
}
export { SignupUseCase };
