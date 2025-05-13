import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDTO } from './app/dto/create-user.dto';
import { CreateUserUseCase } from './app/use-cases/create-user-use-case';
import { ListUsersUseCase } from './app/use-cases/list-users-use-case';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) {}

  @Post('/')
  async createUser(@Body() input: CreateUserDTO) {
    return await this.createUserUseCase.execute(input);
  }

  @Get('/')
  async listUsers() {
    return await this.listUsersUseCase.execute();
  }
}
