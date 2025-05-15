import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { History } from 'src/history/domain/entities/history';
import { HistoryRepository } from 'src/history/infra/database/mongo/repository/history-repository';
import { FindByWordUseCase } from './find-by-word-use-case';

describe('FindByWordUseCase', () => {
  let sut: FindByWordUseCase;
  let historyRepository: HistoryRepository;
  let jwtService: JwtService;

  const mockToken = 'valid.jwt.token';
  const mockWord = 'test';
  const mockUserId = 'user123';
  const mockSecretKey = 'test-secret';
  const mockDictionaryId = 'dict123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByWordUseCase,
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
  });

  describe('execute', () => {
    it('should successfully update history and return dictionary id', async () => {
      const mockHistory = History.create(
        {
          userId: mockUserId,
          dictionaryId: mockDictionaryId,
          visited: true,
          createdAt: new Date(),
        },
        'hist123',
      );

      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
      jest
        .spyOn(historyRepository, 'updateVisited')
        .mockResolvedValue(mockHistory);

      const result = await sut.execute(mockToken, mockWord);

      expect(result).toEqual({
        id: mockDictionaryId,
      });
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken, {
        secret: mockSecretKey,
      });
      expect(historyRepository.updateVisited).toHaveBeenCalledWith(
        mockUserId,
        mockWord,
      );
    });

    it('should return null when history update fails', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
      jest.spyOn(historyRepository, 'updateVisited').mockResolvedValue(null);

      const result = await sut.execute(mockToken, mockWord);

      expect(result).toBeNull();
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
