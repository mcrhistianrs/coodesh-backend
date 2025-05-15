import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Dictionary } from 'src/dictionary/domain/entities/dictionary';
import { DictionaryDao } from 'src/dictionary/infra/database/mongo/dao/dictionary-dao';
import { FavoriteRepository } from 'src/favorite/infra/database/mongo/repository/favorite-repository';
import { UnfavoriteUseCase } from './unfavorite-use-case';

describe('UnfavoriteUseCase', () => {
  let sut: UnfavoriteUseCase;
  let favoriteRepository: FavoriteRepository;
  let dictionaryDao: DictionaryDao;
  let jwtService: JwtService;

  const mockToken = 'valid.jwt.token';
  const mockWord = 'test';
  const mockUserId = 'user123';
  const mockSecretKey = 'test-secret';
  const mockDictionaryId = 'dict123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnfavoriteUseCase,
        {
          provide: FavoriteRepository,
          useValue: {
            removeFavorite: jest.fn(),
          },
        },
        {
          provide: DictionaryDao,
          useValue: {
            findByWord: jest.fn(),
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

    sut = module.get<UnfavoriteUseCase>(UnfavoriteUseCase);
    favoriteRepository = module.get<FavoriteRepository>(FavoriteRepository);
    dictionaryDao = module.get<DictionaryDao>(DictionaryDao);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('execute', () => {
    it('should successfully remove a word from favorites', async () => {
      const mockDictionary = Dictionary.create(
        { word: mockWord },
        mockDictionaryId,
      );

      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
      jest.spyOn(dictionaryDao, 'findByWord').mockResolvedValue(mockDictionary);
      jest.spyOn(favoriteRepository, 'removeFavorite').mockResolvedValue(true);

      const result = await sut.execute(mockToken, mockWord);

      expect(result).toEqual({
        success: true,
        message: `Removed "${mockWord}" from favorites`,
      });
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken, {
        secret: mockSecretKey,
      });
      expect(dictionaryDao.findByWord).toHaveBeenCalledWith({ word: mockWord });
      expect(favoriteRepository.removeFavorite).toHaveBeenCalledWith(
        mockUserId,
        mockWord,
      );
    });

    it('should return failure when word is not found in dictionary', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
      jest.spyOn(dictionaryDao, 'findByWord').mockResolvedValue(null);

      const result = await sut.execute(mockToken, mockWord);

      expect(result).toEqual({
        success: false,
        message: `Word "${mockWord}" not found in dictionary`,
      });
    });

    it('should return failure when favorite cannot be removed', async () => {
      const mockDictionary = Dictionary.create(
        { word: mockWord },
        mockDictionaryId,
      );

      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
      jest.spyOn(dictionaryDao, 'findByWord').mockResolvedValue(mockDictionary);
      jest.spyOn(favoriteRepository, 'removeFavorite').mockResolvedValue(false);

      const result = await sut.execute(mockToken, mockWord);

      expect(result).toEqual({
        success: false,
        message: `Word "${mockWord}" not found in favorites or could not be removed`,
      });
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
