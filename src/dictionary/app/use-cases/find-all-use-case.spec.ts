import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Dictionary } from 'src/dictionary/domain/entities/dictionary';
import { DictionaryDao } from 'src/dictionary/infra/database/mongo/dao/dictionary-dao';
import { FindAllUseCase } from './find-all-use-case';

describe('FindAllUseCase', () => {
  let sut: FindAllUseCase;
  let dictionaryDAO: DictionaryDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUseCase,
        {
          provide: DictionaryDao,
          useValue: {
            findAll: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    sut = module.get<FindAllUseCase>(FindAllUseCase);
    dictionaryDAO = module.get<DictionaryDao>(DictionaryDao);
  });

  describe('execute', () => {
    it('should successfully return paginated dictionary results', async () => {
      const mockDictionaries = [
        Dictionary.create({ word: 'test1' }, 'dict1'),
        Dictionary.create({ word: 'test2' }, 'dict2'),
        Dictionary.create({ word: 'test3' }, 'dict3'),
      ];
      const mockTotalCount = 3;
      const mockInput = { search: '', limit: '2', page: '1' };

      jest.spyOn(dictionaryDAO, 'findAll').mockResolvedValue(mockDictionaries);
      jest.spyOn(dictionaryDAO, 'count').mockResolvedValue(mockTotalCount);

      const result = await sut.execute(mockInput);

      expect(result).toEqual({
        results: ['test1', 'test2'],
        totalDocs: mockTotalCount,
        page: 1,
        totalPages: 2,
        hasNext: true,
        hasPrev: false,
      });
      expect(dictionaryDAO.findAll).toHaveBeenCalledWith(mockInput);
      expect(dictionaryDAO.count).toHaveBeenCalledWith(mockInput);
    });

    it('should use default pagination values when not provided', async () => {
      const mockDictionaries = [Dictionary.create({ word: 'test1' }, 'dict1')];
      const mockTotalCount = 1;

      jest.spyOn(dictionaryDAO, 'findAll').mockResolvedValue(mockDictionaries);
      jest.spyOn(dictionaryDAO, 'count').mockResolvedValue(mockTotalCount);

      const result = await sut.execute();

      expect(result).toEqual({
        results: ['test1'],
        totalDocs: mockTotalCount,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
      expect(dictionaryDAO.findAll).toHaveBeenCalledWith({
        search: undefined,
        limit: '10',
        page: '1',
      });
    });

    it('should handle empty results', async () => {
      jest.spyOn(dictionaryDAO, 'findAll').mockResolvedValue([]);
      jest.spyOn(dictionaryDAO, 'count').mockResolvedValue(0);

      const result = await sut.execute();

      expect(result).toEqual({
        results: [],
        totalDocs: 0,
        page: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should throw BadRequestException when an error occurs', async () => {
      jest
        .spyOn(dictionaryDAO, 'findAll')
        .mockRejectedValue(new Error('Database error'));

      await expect(sut.execute()).rejects.toThrow(BadRequestException);
    });
  });
});
