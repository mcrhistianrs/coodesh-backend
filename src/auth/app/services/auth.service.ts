import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IHashService } from 'src/hash/app/domain/interface/interface-hash-service';
import { User } from 'src/user/domain/entities/user';
import { IUserDAO } from 'src/user/domain/interfaces/interface-user-dao';

@Injectable()
export class AuthService {
  private secretKey: string;
  private jwtService: JwtService;

  constructor(
    private readonly configService: ConfigService,
    jwtService: JwtService,
    @Inject('IUserDAO')
    private readonly userDAO: IUserDAO,
    @Inject('IHashService')
    private readonly hashService: IHashService,
  ) {
    this.jwtService = jwtService;
    const secretKey = this.configService.get<string>('JWT_SECRET');
    if (!secretKey) {
      throw new Error('JWT_SECRET_KEY is not defined');
    }
    this.secretKey = secretKey;
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.userDAO.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    return isPasswordValid;
  }

  async generateToken(user: User): Promise<string> {
    return this.jwtService.sign(
      { id: user.id },
      { secret: this.secretKey, expiresIn: '1h' },
    );
  }
}
