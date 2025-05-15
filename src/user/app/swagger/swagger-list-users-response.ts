import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const SwaggerListUsersResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Users successfully retrieved.',
      schema: {
        example: {
          data: [
            {
              id: '507f1f77bcf86cd799439011',
              name: 'John Doe',
              email: 'john.doe@example.com',
              createdAt: '2024-03-21T10:00:00.000Z',
            },
            {
              id: '507f1f77bcf86cd799439012',
              name: 'Jane Smith',
              email: 'jane.smith@example.com',
              createdAt: '2024-03-21T09:30:00.000Z',
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
  );
