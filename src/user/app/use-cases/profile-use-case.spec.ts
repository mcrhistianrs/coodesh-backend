import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Dictionary } from 'src/dictionary/domain/entities/dictionary';
import { DictionaryDao } from 'src/dictionary/infra/database/mongo/dao/dictionary-dao';
import { User } from '../../domain/entities/user';
import { IUserDAO } from '../../domain/interfaces/interface-user-dao';
import { ProfileUseCase } from './profile-use-case';

describe('ProfileUseCase', () => {
  let sut: ProfileUseCase;
  let userDAO: IUserDAO;
  let dictionaryDao: DictionaryDao;
  let jwtService: JwtService;

  const mockToken = 'valid.jwt.token';
  const mockUserId = 'user123';
  const mockSecretKey = 'test-secret';
  const mockDictionaryId = 'dict123';

  const mockUser = User.create(
    {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    },
    mockUserId,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileUseCase,
        {
          provide: 'IUserDAO',
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: DictionaryDao,
          useValue: {
            findById: jest.fn(),
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

    sut = module.get<ProfileUseCase>(ProfileUseCase);
    userDAO = module.get<IUserDAO>('IUserDAO');
    dictionaryDao = module.get<DictionaryDao>(DictionaryDao);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('execute', () => {
    beforeEach(() => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockUserId });
    });

    it('should successfully return user profile without dictionary', async () => {
      jest.spyOn(userDAO, 'findById').mockResolvedValue(mockUser);

      const result = await sut.execute(mockToken);

      expect(result).toEqual({
        success: true,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      });
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken, {
        secret: mockSecretKey,
      });
      expect(userDAO.findById).toHaveBeenCalledWith(mockUserId);
      expect(dictionaryDao.findById).not.toHaveBeenCalled();
    });

    it('should successfully return user profile with dictionary', async () => {
      const mockDictionary = Dictionary.create(
        {
          word: 'test',
        },
        mockDictionaryId,
      );

      jest.spyOn(userDAO, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(dictionaryDao, 'findById').mockResolvedValue(mockDictionary);

      const result = await sut.execute(mockToken, mockDictionaryId);

      expect(result).toEqual({
        success: true,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
        dictionary: mockDictionary,
      });
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken, {
        secret: mockSecretKey,
      });
      expect(userDAO.findById).toHaveBeenCalledWith(mockUserId);
      expect(dictionaryDao.findById).toHaveBeenCalledWith(mockDictionaryId);
    });

    it('should return failure when user is not found', async () => {
      jest.spyOn(userDAO, 'findById').mockResolvedValue(null);

      const result = await sut.execute(mockToken);

      expect(result).toEqual({
        success: false,
        message: 'User not found',
      });
      expect(dictionaryDao.findById).not.toHaveBeenCalled();
    });

    it('should return failure when dictionary is not found', async () => {
      jest.spyOn(userDAO, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(dictionaryDao, 'findById').mockResolvedValue(null);

      const result = await sut.execute(mockToken, mockDictionaryId);

      expect(result).toEqual({
        success: false,
        message: `Dictionary with ID "${mockDictionaryId}" not found`,
      });
    });

    it('should throw BadRequestException when JWT verification fails', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(sut.execute(mockToken)).rejects.toThrow(BadRequestException);
      expect(userDAO.findById).not.toHaveBeenCalled();
      expect(dictionaryDao.findById).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when DAO operation fails', async () => {
      jest.spyOn(userDAO, 'findById').mockRejectedValue(new Error('DAO error'));

      await expect(sut.execute(mockToken)).rejects.toThrow(BadRequestException);
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken, {
        secret: mockSecretKey,
      });
      expect(userDAO.findById).toHaveBeenCalledWith(mockUserId);
      expect(dictionaryDao.findById).not.toHaveBeenCalled();
    });
  });
});
