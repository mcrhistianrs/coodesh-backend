import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/app/guards/jwt-auth.guard';

export const SwaggerAddFavoriteResponse = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiParam({
      name: 'word',
      description: 'The word to be added to favorites',
      example: 'serendipity',
    }),
    ApiResponse({
      status: 200,
      description: 'Word successfully added to favorites.',
      schema: {
        example: {
          success: true,
          message: 'Added "serendipity" to favorites',
          favorite: {
            id: '507f1f77bcf86cd799439011',
            userId: 'user123',
            dictionaryId: '507f1f77bcf86cd799439012',
            visited: true,
            createdAt: '2024-03-21T10:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request.',
      content: {
        'application/json': {
          examples: {
            wordNotFound: {
              value: {
                success: false,
                message: 'Word "serendipity" not found in dictionary',
              },
            },
            favoriteError: {
              value: {
                success: false,
                message: 'Could not add word to favorites',
              },
            },
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
  );
