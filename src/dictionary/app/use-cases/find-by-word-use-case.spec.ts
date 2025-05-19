import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { FreeDictionaryServices } from 'src/free-dictionary/services/free-dictionary.services';
import { History } from 'src/history/domain/entities/history';
import { HistoryRepository } from 'src/history/infra/database/mongo/repository/history-repository';
import { FindByWordUseCase } from './find-by-word-use-case';

describe('FindByWordUseCase', () => {
  let sut: FindByWordUseCase;
  let historyRepository: HistoryRepository;
  let jwtService: JwtService;
  let freeDictionaryServices: FreeDictionaryServices;

  const mockToken = 'valid.jwt.token';
  const mockWord = 'test';
  const mockUserId = 'user123';
  const mockSecretKey = 'test-secret';
  const mockDictionaryId = 'dict123';
  const mockDictionaryInfo = {
    word: mockWord,
    phonetic: '/test/',
    phonetics: [
      {
        text: '/test/',
        audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/test.mp3',
      },
    ],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A procedure for critical evaluation',
            example: 'This is a test example',
            synonyms: ['trial', 'experiment'],
            antonyms: ['result'],
          },
        ],
      },
    ],
    license: {
      name: 'CC BY-SA 3.0',
      url: 'https://creativecommons.org/licenses/by-sa/3.0',
    },
    sourceUrls: ['https://en.wiktionary.org/wiki/test'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByWordUseCase,
        FreeDictionaryServices,
        {
          provide: HistoryRepository,
          useValue: {
            updateVisited: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(mockSecretKey),
          },
        },
      ],
    }).compile();

    sut = module.get<FindByWordUseCase>(FindByWordUseCase);
    historyRepository = module.get<HistoryRepository>(HistoryRepository);
    jwtService = module.get<JwtService>(JwtService);
    freeDictionaryServices = module.get<FreeDictionaryServices>(
      FreeDictionaryServices,
    );
  });

  describe('execute', () => {
    it('should successfully update history and return dictionary information', async () => {
      const mockHistory = History.create(
        {
          userId: mockUserId,
          dictionaryId: mockDictionaryId,
          visited: true,
          createdAt: new Date(),
        },
        'hist123',
      );

      jest
        .spyOn(freeDictionaryServices, 'getInformation')
        .mockResolvedValue(mockDictionaryInfo);
      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
      jest
        .spyOn(historyRepository, 'updateVisited')
        .mockResolvedValue(mockHistory);

      const result = await sut.execute(mockToken, mockWord);

      expect(result.results).not.toBeNull();
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken, {
        secret: mockSecretKey,
      });
      expect(historyRepository.updateVisited).toHaveBeenCalledWith(
        mockUserId,
        mockWord,
      );
    });

    it('should return paginated response when history update fails', async () => {
      jest
        .spyOn(freeDictionaryServices, 'getInformation')
        .mockResolvedValue(mockDictionaryInfo);
      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
      jest.spyOn(historyRepository, 'updateVisited').mockResolvedValue(null);

      const result = await sut.execute(mockToken, mockWord);

      expect(result.results).not.toBeNull();
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken, {
        secret: mockSecretKey,
      });
      expect(historyRepository.updateVisited).toHaveBeenCalledWith(
        mockUserId,
        mockWord,
      );
    });

    it('should throw BadRequestException when JWT verification fails', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(sut.execute(mockToken, mockWord)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
