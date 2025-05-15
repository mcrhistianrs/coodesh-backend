import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/app/guards/jwt-auth.guard';

export const SwaggerListFavoritesResponse = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Favorites successfully retrieved.',
      schema: {
        example: {
          data: [
            {
              word: 'serendipity',
              added: '2024-03-21T10:00:00.000Z',
            },
            {
              word: 'ephemeral',
              added: '2024-03-21T09:30:00.000Z',
            },
          ],
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
