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
          results: [
            {
              word: 'serendipity',
              phonetic: '/ˌserənˈdipədē/',
              phonetics: [
                {
                  text: '/ˌserənˈdipədē/',
                  audio:
                    'https://api.dictionaryapi.dev/media/pronunciations/en/serendipity.mp3',
                },
              ],
              meanings: [
                {
                  partOfSpeech: 'noun',
                  definitions: [
                    {
                      definition:
                        'The occurrence of events by chance in a happy or beneficial way.',
                      example: 'Finding this book was pure serendipity.',
                      synonyms: ['chance', 'fortune', 'luck'],
                      antonyms: ['misfortune', 'bad luck'],
                    },
                  ],
                },
              ],
              license: {
                name: 'CC BY-SA 3.0',
                url: 'https://creativecommons.org/licenses/by-sa/3.0',
              },
              sourceUrls: ['https://en.wiktionary.org/wiki/serendipity'],
            },
          ],
          totalDocs: 1,
          page: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
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
            message: 'Error processing find by word request',
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
