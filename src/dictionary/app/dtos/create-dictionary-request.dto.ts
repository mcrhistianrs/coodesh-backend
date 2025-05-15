import { ApiProperty } from '@nestjs/swagger';

export class CreateDictionaryRequestDto {
  @ApiProperty({
    description: 'The word to be added to the dictionary',
    example: 'serendipity',
  })
  word: string;

  @ApiProperty({
    description: 'The definition of the word',
    example: 'The occurrence of events by chance in a happy or beneficial way.',
  })
  definition: string;

  @ApiProperty({
    description: 'Example sentences using the word',
    example: [
      'Finding this book was pure serendipity.',
      'It was serendipity that led me to meet my future business partner.',
    ],
    type: [String],
  })
  examples?: string[];

  @ApiProperty({
    description: 'Synonyms of the word',
    example: ['chance', 'fortune', 'luck'],
    type: [String],
  })
  synonyms?: string[];

  @ApiProperty({
    description: 'Antonyms of the word',
    example: ['misfortune', 'bad luck'],
    type: [String],
  })
  antonyms?: string[];

  @ApiProperty({
    description: 'The etymology of the word',
    example:
      'From Serendip, an old name for Sri Lanka, in the Persian fairy tale "The Three Princes of Serendip"',
  })
  etymology?: string;

  @ApiProperty({
    description: 'The pronunciation of the word',
    example: 'ˌserənˈdipədē',
  })
  pronunciation?: string;

  @ApiProperty({
    description: 'The part of speech of the word',
    example: 'noun',
    enum: [
      'noun',
      'verb',
      'adjective',
      'adverb',
      'preposition',
      'conjunction',
      'pronoun',
      'interjection',
    ],
  })
  partOfSpeech?: string;
}
