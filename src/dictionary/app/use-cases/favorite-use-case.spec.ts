import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Dictionary } from 'src/dictionary/domain/entities/dictionary';
import { DictionaryDao } from 'src/dictionary/infra/database/mongo/dao/dictionary-dao';
import { Favorite } from 'src/favorite/domain/entities/favorite';
import { FavoriteRepository } from 'src/favorite/infra/database/mongo/repository/favorite-repository';
import { FavoriteUseCase } from './favorite-use-case';

describe('FavoriteUseCase', () => {
  let sut: FavoriteUseCase;
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
        FavoriteUseCase,
        {
          provide: FavoriteRepository,
          useValue: {
            updateFavorite: jest.fn(),
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

    sut = module.get<FavoriteUseCase>(FavoriteUseCase);
    favoriteRepository = module.get<FavoriteRepository>(FavoriteRepository);
    dictionaryDao = module.get<DictionaryDao>(DictionaryDao);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('favorite', () => {
    it('should successfully add a word to favorites', async () => {
      const mockDictionary = Dictionary.create(
        { word: mockWord },
        mockDictionaryId,
      );
      const mockFavorite = Favorite.create({
        userId: mockUserId,
        dictionaryId: mockDictionaryId,
        visited: false,
        createdAt: new Date(),
      });

      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
      jest.spyOn(dictionaryDao, 'findByWord').mockResolvedValue(mockDictionary);
      jest
        .spyOn(favoriteRepository, 'updateFavorite')
        .mockResolvedValue(mockFavorite);

      const result = await sut.favorite(mockToken, mockWord);

      expect(result).toEqual({
        success: true,
        message: `Added "${mockWord}" to favorites`,
        favorite: mockFavorite,
      });
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken, {
        secret: mockSecretKey,
      });
      expect(dictionaryDao.findByWord).toHaveBeenCalledWith({ word: mockWord });
      expect(favoriteRepository.updateFavorite).toHaveBeenCalledWith(
        mockUserId,
        mockWord,
      );
    });

    it('should return failure when word is not found in dictionary', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
      jest.spyOn(dictionaryDao, 'findByWord').mockResolvedValue(null);

      const result = await sut.favorite(mockToken, mockWord);

      expect(result).toEqual({
        success: false,
        message: `Word "${mockWord}" not found in dictionary`,
      });
    });

    it('should return failure when favorite cannot be added', async () => {
      const mockDictionary = Dictionary.create(
        { word: mockWord },
        mockDictionaryId,
      );

      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
      jest.spyOn(dictionaryDao, 'findByWord').mockResolvedValue(mockDictionary);
      jest.spyOn(favoriteRepository, 'updateFavorite').mockResolvedValue(null);

      const result = await sut.favorite(mockToken, mockWord);

      expect(result).toEqual({
        success: false,
        message: 'Could not add word to favorites',
      });
    });

    it('should throw BadRequestException when JWT verification fails', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(sut.favorite(mockToken, mockWord)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('unfavorite', () => {
    it('should successfully remove a word from favorites', async () => {
      const mockDictionary = Dictionary.create(
        { word: mockWord },
        mockDictionaryId,
      );

      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
      jest.spyOn(dictionaryDao, 'findByWord').mockResolvedValue(mockDictionary);
      jest.spyOn(favoriteRepository, 'removeFavorite').mockResolvedValue(true);

      const result = await sut.unfavorite(mockToken, mockWord);

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

      const result = await sut.unfavorite(mockToken, mockWord);

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

      const result = await sut.unfavorite(mockToken, mockWord);

      expect(result).toEqual({
        success: false,
        message: `Word "${mockWord}" not found in favorites or could not be removed`,
      });
    });

    it('should throw BadRequestException when JWT verification fails', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(sut.unfavorite(mockToken, mockWord)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
