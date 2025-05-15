import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import HashService from './hash.service';

jest.mock('bcryptjs');

describe('HashService', () => {
  let sut: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    sut = module.get<HashService>(HashService);
  });

  describe('hash', () => {
    const mockPassword = 'test-password';
    const mockSalt = 'test-salt';
    const mockHashedPassword = 'hashed-password';

    beforeEach(() => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
    });

    it('should successfully hash a password', async () => {
      const result = await sut.hash(mockPassword);

      expect(result).toBe(mockHashedPassword);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, mockSalt);
    });

    it('should throw error when genSalt fails', async () => {
      const error = new Error('Salt generation failed');
      (bcrypt.genSalt as jest.Mock).mockRejectedValue(error);

      await expect(sut.hash(mockPassword)).rejects.toThrow(error);
    });

    it('should throw error when hash fails', async () => {
      const error = new Error('Hash generation failed');
      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(sut.hash(mockPassword)).rejects.toThrow(error);
    });
  });

  describe('compare', () => {
    const mockPassword = 'test-password';
    const mockEncryptedPassword = 'encrypted-password';

    it('should return true when passwords match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await sut.compare(mockPassword, mockEncryptedPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockPassword,
        mockEncryptedPassword,
      );
    });

    it('should return false when passwords do not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await sut.compare(mockPassword, mockEncryptedPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockPassword,
        mockEncryptedPassword,
      );
    });

    it('should throw error when compare fails', async () => {
      const error = new Error('Compare failed');
      (bcrypt.compare as jest.Mock).mockRejectedValue(error);

      await expect(
        sut.compare(mockPassword, mockEncryptedPassword),
      ).rejects.toThrow(error);
    });
  });
});
