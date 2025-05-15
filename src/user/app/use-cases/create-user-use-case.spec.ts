import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import HashService from 'src/hash/app/services/hash.service';
import { User } from '../../domain/entities/user';
import { IUserDAO } from '../../domain/interfaces/interface-user-dao';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserOutputDTO } from '../dto/user-output.dto';
import { CreateUserUseCase } from './create-user-use-case';

describe('CreateUserUseCase', () => {
  let sut: CreateUserUseCase;
  let userDAO: IUserDAO;
  let hashService: HashService;

  const mockInput: CreateUserDTO = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  const mockUserId = 'user123';
  const mockHashedPassword = 'hashed-password';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'IUserDAO',
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'IHashService',
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    sut = module.get<CreateUserUseCase>(CreateUserUseCase);
    userDAO = module.get<IUserDAO>('IUserDAO');
    hashService = module.get<HashService>('IHashService');
  });

  describe('execute', () => {
    it('should successfully create a user', async () => {
      const mockUser = User.create(
        {
          email: mockInput.email,
          password: mockHashedPassword,
          name: mockInput.name,
        },
        mockUserId,
      );

      const expectedOutput = new UserOutputDTO(
        mockUser.id,
        mockUser.email,
        mockUser.name,
      );

      jest.spyOn(hashService, 'hash').mockResolvedValue(mockHashedPassword);
      jest.spyOn(userDAO, 'create').mockResolvedValue(mockUser);

      const result = await sut.execute(mockInput);

      expect(result).toEqual(expectedOutput);
      expect(hashService.hash).toHaveBeenCalledWith(mockInput.password);
      expect(userDAO.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockInput.email,
          password: mockHashedPassword,
          name: mockInput.name,
        }),
      );
    });

    it('should throw BadRequestException when hash service fails', async () => {
      jest
        .spyOn(hashService, 'hash')
        .mockRejectedValue(new Error('Hash error'));

      await expect(sut.execute(mockInput)).rejects.toThrow(BadRequestException);
      expect(hashService.hash).toHaveBeenCalledWith(mockInput.password);
      expect(userDAO.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when DAO operation fails', async () => {
      jest.spyOn(hashService, 'hash').mockResolvedValue(mockHashedPassword);
      jest.spyOn(userDAO, 'create').mockRejectedValue(new Error('DAO error'));

      await expect(sut.execute(mockInput)).rejects.toThrow(BadRequestException);
      expect(hashService.hash).toHaveBeenCalledWith(mockInput.password);
      expect(userDAO.create).toHaveBeenCalled();
    });
  });
});
