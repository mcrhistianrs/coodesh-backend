import { Controller, Get, Param } from '@nestjs/common';
import { HistoryMapper } from './app/mapper/history-mapper';
import { HistoryDao } from './infra/database/mongo/dao/history-dao';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyDAO: HistoryDao) {}

  @Get(':userId')
  async findAll(@Param('userId') userId: string) {
    const histories = await this.historyDAO.findAll(userId);
    return histories.map(HistoryMapper.toOutput);
  }
}
