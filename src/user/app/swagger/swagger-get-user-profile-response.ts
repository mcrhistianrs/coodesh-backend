import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/app/guards/jwt-auth.guard';

export const SwaggerGetUserProfileResponse = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'User profile successfully retrieved.',
      schema: {
        example: {
          id: '507f1f77bcf86cd799439011',
          name: 'John Doe',
          email: 'john.doe@example.com',
          createdAt: '2024-03-21T10:00:00.000Z',
          stats: {
            totalSearches: 42,
            totalFavorites: 15,
            lastSearch: '2024-03-21T10:00:00.000Z',
            lastFavorite: '2024-03-21T09:30:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
      content: {
        'application/json': {
          example: {
            code: 'unauthorized_exception',
            message: 'Invalid or expired token.',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found.',
      content: {
        'application/json': {
          example: {
            code: 'not_found_exception',
            message: 'User not found.',
          },
        },
      },
    }),
  );
