import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthDTO } from '../dto/aut-dto';

export const SwaggerSigninResponse = () =>
  applyDecorators(
    ApiBody({ type: AuthDTO }),
    ApiResponse({
      status: 200,
      description: 'User successfully authenticated.',
      schema: {
        example: {
          id: '507f1f77bcf86cd799439011',
          name: 'John Doe',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request.',
      content: {
        'application/json': {
          examples: {
            invalidCredentials: {
              value: {
                code: 'invalid_credentials',
                message: 'Invalid email or password.',
              },
            },
            userNotFound: {
              value: {
                code: 'user_not_found',
                message: 'User not found.',
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
            message: 'Invalid or expired credentials.',
          },
        },
      },
    }),
  );
