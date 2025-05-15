import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/app/guards/jwt-auth.guard';

export const SwaggerFindByWordResponse = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiParam({
      name: 'word',
      description: 'The word to search for',
      example: 'serendipity',
    }),
    ApiResponse({
      status: 200,
      description: 'Word successfully found.',
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
          isFavorite: true,
          history: {
            id: '507f1f77bcf86cd799439012',
            userId: 'user123',
            word: 'serendipity',
            searchedAt: '2024-03-21T10:00:00.000Z',
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
            message: 'Invalid word provided.',
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
      description: 'Word not found.',
      content: {
        'application/json': {
          example: {
            code: 'not_found_exception',
            message: 'Word not found in dictionary.',
          },
        },
      },
    }),
  );
