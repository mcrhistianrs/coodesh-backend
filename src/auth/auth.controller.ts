import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/app/dto/create-user.dto';
import { AuthDTO } from './app/dto/aut-dto';
import { AuthService } from './app/services/auth.service';
import { SwaggerSigninResponse } from './app/swagger/swagger-signin-response';
import { SwaggerSignupResponse } from './app/swagger/swagger-signup-response';
import LoginUseCase from './app/use-cases/login-use-case';
import { SignupUseCase } from './app/use-cases/signup-use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly signupUseCase: SignupUseCase,
    private readonly authService: AuthService,
  ) {}

  @Post('signin')
  @SwaggerSigninResponse()
  async login(@Body() input: AuthDTO) {
    await this.authService.validateUser(input.email, input.password);
    return await this.loginUseCase.execute(input.email);
  }

  @Post('signup')
  @SwaggerSignupResponse()
  async signup(@Body() input: CreateUserDTO) {
    return await this.signupUseCase.execute(input);
  }
}
