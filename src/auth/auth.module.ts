import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashModule } from '../hash/hash.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './app/services/auth.service';
import { JwtStrategy } from './app/strategy/jwt-strategy';
import { LocalStrategy } from './app/strategy/local-strategy';
import LoginUseCase from './app/use-cases/login-use-case';
import { SignupUseCase } from './app/use-cases/signup-use-case';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    forwardRef(() => HashModule),
  ],
  providers: [
    AuthService,
    LoginUseCase,
    SignupUseCase,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
