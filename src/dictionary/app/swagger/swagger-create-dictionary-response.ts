import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/app/guards/jwt-auth.guard';
import { CreateDictionaryRequestDto } from '../dtos/create-dictionary-request.dto';

export const SwaggerCreateDictionaryResponse = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiBody({ type: CreateDictionaryRequestDto }),
    ApiResponse({
      status: 201,
      description: 'Dictionary entry successfully created.',
      schema: {
        example: {
          id: '507f1f77bcf86cd799439011',
          word: 'serendipity',
          definition:
            'The occurrence of events by chance in a happy or beneficial way.',
          examples: [
            'Finding this book was pure serendipity.',
            'It was serendipity that led me to meet my future business partner.',
          ],
          synonyms: ['chance', 'fortune', 'luck'],
          antonyms: ['misfortune', 'bad luck'],
          etymology:
            'From Serendip, an old name for Sri Lanka, in the Persian fairy tale "The Three Princes of Serendip"',
          pronunciation: 'ˌserənˈdipədē',
          partOfSpeech: 'noun',
          createdBy: 'user@example.com',
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
            duplicateWord: {
              value: {
                code: 'duplicate_word_exception',
                message: 'A dictionary entry for this word already exists.',
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
    ApiResponse({
      status: 403,
      description: 'Forbidden.',
      content: {
        'application/json': {
          example: {
            code: 'forbidden_exception',
            message: 'You do not have permission to create dictionary entries.',
          },
        },
      },
    }),
  );
