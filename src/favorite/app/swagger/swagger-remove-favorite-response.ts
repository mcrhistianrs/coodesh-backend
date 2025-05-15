import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/app/guards/jwt-auth.guard';

export const SwaggerRemoveFavoriteResponse = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiParam({
      name: 'word',
      description: 'The word to be removed from favorites',
      example: 'serendipity',
    }),
    ApiResponse({
      status: 200,
      description: 'Word successfully removed from favorites.',
      schema: {
        example: {
          success: true,
          message: 'Removed "serendipity" from favorites',
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
            favoriteNotFound: {
              value: {
                success: false,
                message:
                  'Word "serendipity" not found in favorites or could not be removed',
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
