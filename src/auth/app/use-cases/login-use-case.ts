import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IHashService } from 'src/hash/app/domain/interface/interface-hash-service';
import { IUserDAO } from 'src/user/domain/interfaces/interface-user-dao';
import { AuthOutputDTO } from '../dto/auth-output-dto';
import { AuthService } from '../services/auth.service';

@Injectable()
class LoginUseCase {
  constructor(
    private readonly authService: AuthService,
    @Inject('IUserDAO')
    private readonly userDAO: IUserDAO,
    @Inject('IHashService')
    private readonly hashService: IHashService,
  ) {}

  async execute(email: string): Promise<AuthOutputDTO> {
    const user = await this.userDAO.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new AuthOutputDTO(await this.authService.generateToken(user));
  }
}

export default LoginUseCase;
