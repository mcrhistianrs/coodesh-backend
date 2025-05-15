import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDTO } from '../dto/create-user.dto';

export const SwaggerCreateUserResponse = () =>
  applyDecorators(
    ApiBody({ type: CreateUserDTO }),
    ApiResponse({
      status: 201,
      description: 'User successfully created.',
      schema: {
        example: {
          id: '507f1f77bcf86cd799439011',
          name: 'John Doe',
          email: 'john.doe@example.com',
          createdAt: '2024-03-21T10:00:00.000Z',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request.',
      content: {
        'application/json': {
          examples: {
            invalidInput: {
              value: {
                code: 'invalid_input_exception',
                message: 'Invalid input data.',
              },
            },
            duplicateEmail: {
              value: {
                code: 'duplicate_email_exception',
                message: 'A user with this email already exists.',
              },
            },
          },
        },
      },
    }),
  );
