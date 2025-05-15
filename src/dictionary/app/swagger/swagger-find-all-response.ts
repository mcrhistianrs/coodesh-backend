import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

export const SwaggerFindAllResponse = () =>
  applyDecorators(
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
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Search term to filter words',
      type: String,
      example: 'serendip',
    }),
    ApiResponse({
      status: 200,
      description: 'Dictionary entries successfully retrieved.',
      schema: {
        example: {
          data: [
            {
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
            },
          ],
          pagination: {
            total: 1,
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
