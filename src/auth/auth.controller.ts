import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO } from 'src/user/app/dto/create-user.dto';
import { AuthDTO } from './app/dto/aut-dto';
import LoginUseCase from './app/use-cases/login-use-case';
import { SignupUseCase } from './app/use-cases/signup-use-case';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly signupUseCase: SignupUseCase,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async login(@Body() input: AuthDTO) {
    const { email } = input;
    return await this.loginUseCase.execute(email);
  }
  @Post('signup')
  async signup(@Body() input: CreateUserDTO) {
    return await this.signupUseCase.execute(input);
  }
}
