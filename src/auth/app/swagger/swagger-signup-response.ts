import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/user/app/dto/create-user.dto';

export const SwaggerSignupResponse = () =>
  applyDecorators(
    ApiBody({ type: CreateUserDTO }),
    ApiResponse({
      status: 201,
      description: 'User successfully registered.',
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
            userExists: {
              value: {
                code: 'user_already_exists',
                message: 'A user with this email already exists.',
              },
            },
            invalidInput: {
              value: {
                code: 'invalid_input_exception',
                message: 'Invalid input data.',
              },
            },
          },
        },
      },
    }),
  );
