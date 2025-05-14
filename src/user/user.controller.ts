import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/app/guards/jwt-auth.guard';
import { CreateUserDTO } from './app/dto/create-user.dto';
import { FavoriteDto } from './app/dto/favorite.dto';
import { HistoryDto } from './app/dto/history.dto';
import { CreateUserUseCase } from './app/use-cases/create-user-use-case';
import { FavoriteUseCase } from './app/use-cases/favorite-use-case';
import { HistoryUseCase } from './app/use-cases/history-use-case';
import { ListUsersUseCase } from './app/use-cases/list-users-use-case';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly historyUseCase: HistoryUseCase,
    private readonly favoriteUseCase: FavoriteUseCase,
  ) {}

  @Post('/')
  async createUser(@Body() input: CreateUserDTO) {
    return await this.createUserUseCase.execute(input);
  }

  @Get('/')
  async listUsers() {
    return await this.listUsersUseCase.execute();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me/history')
  async getUserHistory(
    @Headers('authorization') authorization: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const token = authorization.split(' ')[1];
    const historyDto: HistoryDto & { page?: string; limit?: string } = {
      token,
      page,
      limit,
    };
    return await this.historyUseCase.execute(historyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me/favorites')
  async getUserFavorites(
    @Headers('authorization') authorization: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const token = authorization.split(' ')[1];
    const favoriteDto: FavoriteDto & { page?: string; limit?: string } = {
      token,
      page,
      limit,
    };
    return await this.favoriteUseCase.execute(favoriteDto);
  }
}
