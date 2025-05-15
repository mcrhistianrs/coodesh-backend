import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/app/guards/jwt-auth.guard';

export const SwaggerGetUserHistoryResponse = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number for pagination',
      type: Number,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of items per page',
      type: Number,
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'User history successfully retrieved.',
      schema: {
        example: {
          data: [
            {
              id: '507f1f77bcf86cd799439011',
              word: 'serendipity',
              searchedAt: '2024-03-21T10:00:00.000Z',
            },
            {
              id: '507f1f77bcf86cd799439012',
              word: 'ephemeral',
              searchedAt: '2024-03-21T09:30:00.000Z',
            },
          ],
          pagination: {
            total: 2,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request.',
      content: {
        'application/json': {
          example: {
            code: 'invalid_input_exception',
            message: 'Invalid pagination parameters.',
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
