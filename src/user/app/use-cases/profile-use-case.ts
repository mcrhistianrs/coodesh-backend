import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DictionaryDao } from 'src/dictionary/infra/database/mongo/dao/dictionary-dao';
import { IUserDAO } from 'src/user/domain/interfaces/interface-user-dao';

@Injectable()
class ProfileUseCase {
  private secretKey: string;

  constructor(
    @Inject('IUserDAO')
    private readonly userDAO: IUserDAO,
    private readonly dictionaryDao: DictionaryDao,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('JWT_SECRET');
  }

  async execute(token: string, dictionaryId?: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.secretKey,
      });
      const user = await this.userDAO.findById(decodedToken.id);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      if (dictionaryId) {
        const dictionary = await this.dictionaryDao.findById(dictionaryId);
        if (!dictionary) {
          return {
            success: false,
            message: `Dictionary with ID "${dictionaryId}" not found`,
          };
        }

        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          dictionary,
        };
      }

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch {
      throw new BadRequestException('Error processing profile request');
    }
  }
}

export { ProfileUseCase };
