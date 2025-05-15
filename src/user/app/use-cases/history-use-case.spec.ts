import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { HistoryRepository } from 'src/history/infra/database/mongo/repository/history-repository';
import { HistoryUseCase } from './history-use-case';

describe('HistoryUseCase', () => {
  let sut: HistoryUseCase;
  let historyRepository: HistoryRepository;
  let jwtService: JwtService;

  const mockToken = 'valid.jwt.token';
  const mockUserId = 'user123';
  const mockSecretKey = 'test-secret';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryUseCase,
        {
          provide: HistoryRepository,
          useValue: {
            findAll: jest.fn(),
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

    sut = module.get<HistoryUseCase>(HistoryUseCase);
    historyRepository = module.get<HistoryRepository>(HistoryRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('execute', () => {
    const mockHistoryItems = [
      { id: '1', word: 'test1', userId: mockUserId, createdAt: new Date() },
      { id: '2', word: 'test2', userId: mockUserId, createdAt: new Date() },
      { id: '3', word: 'test3', userId: mockUserId, createdAt: new Date() },
      { id: '4', word: 'test4', userId: mockUserId, createdAt: new Date() },
      { id: '5', word: 'test5', userId: mockUserId, createdAt: new Date() },
    ];

    beforeEach(() => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
    });

    it('should successfully return paginated history', async () => {
      jest
        .spyOn(historyRepository, 'findAll')
        .mockResolvedValue(mockHistoryItems);

      const result = await sut.execute({
        token: mockToken,
        page: '1',
        limit: '2',
      });

      expect(result).toEqual({
        results: mockHistoryItems.slice(0, 2),
        totalDocs: mockHistoryItems.length,
        page: 1,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      });
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken, {
        secret: mockSecretKey,
      });
      expect(historyRepository.findAll).toHaveBeenCalledWith(mockUserId);
    });

    it('should use default pagination values when not provided', async () => {
      jest
        .spyOn(historyRepository, 'findAll')
        .mockResolvedValue(mockHistoryItems);

      const result = await sut.execute({ token: mockToken });

      expect(result).toEqual({
        results: mockHistoryItems,
        totalDocs: mockHistoryItems.length,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should handle empty history list', async () => {
      jest.spyOn(historyRepository, 'findAll').mockResolvedValue([]);

      const result = await sut.execute({ token: mockToken });

      expect(result).toEqual({
        results: [],
        totalDocs: 0,
        page: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should throw BadRequestException when JWT verification fails', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(sut.execute({ token: mockToken })).rejects.toThrow(
        BadRequestException,
      );
      expect(historyRepository.findAll).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when repository operation fails', async () => {
      jest
        .spyOn(historyRepository, 'findAll')
        .mockRejectedValue(new Error('Repository error'));

      await expect(sut.execute({ token: mockToken })).rejects.toThrow(
        BadRequestException,
      );
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken, {
        secret: mockSecretKey,
      });
      expect(historyRepository.findAll).toHaveBeenCalledWith(mockUserId);
    });
  });
});
