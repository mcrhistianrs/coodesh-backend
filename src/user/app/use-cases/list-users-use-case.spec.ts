import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../domain/entities/user';
import { IUserDAO } from '../../domain/interfaces/interface-user-dao';
import { UserOutputDTO } from '../dto/user-output.dto';
import { ListUsersUseCase } from './list-users-use-case';

describe('ListUsersUseCase', () => {
  let sut: ListUsersUseCase;
  let userDAO: IUserDAO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListUsersUseCase,
        {
          provide: 'IUserDAO',
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    sut = module.get<ListUsersUseCase>(ListUsersUseCase);
    userDAO = module.get<IUserDAO>('IUserDAO');
  });

  describe('execute', () => {
    it('should successfully list all users', async () => {
      const mockUsers = [
        User.create(
          {
            email: 'test1@example.com',
            password: 'password1',
            name: 'Test User 1',
          },
          'user1',
        ),
        User.create(
          {
            email: 'test2@example.com',
            password: 'password2',
            name: 'Test User 2',
          },
          'user2',
        ),
      ];

      const expectedOutput = mockUsers.map(
        (user) => new UserOutputDTO(user.id, user.email, user.name),
      );

      jest.spyOn(userDAO, 'findAll').mockResolvedValue(mockUsers);

      const result = await sut.execute();

      expect(result).toEqual(expectedOutput);
      expect(userDAO.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      jest.spyOn(userDAO, 'findAll').mockResolvedValue([]);

      const result = await sut.execute();

      expect(result).toEqual([]);
      expect(userDAO.findAll).toHaveBeenCalled();
    });

    it('should throw BadRequestException when DAO operation fails', async () => {
      jest.spyOn(userDAO, 'findAll').mockRejectedValue(new Error('DAO error'));

      await expect(sut.execute()).rejects.toThrow(BadRequestException);
      expect(userDAO.findAll).toHaveBeenCalled();
    });
  });
});
