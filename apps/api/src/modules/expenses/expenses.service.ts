import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class ExpensesService {
  private ocrQueue: Queue;
  constructor(private prisma: PrismaService) {
    const isDemo = (process.env.DEMO_MODE ?? 'true') !== 'false';
    if (!isDemo) {
      const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
      this.ocrQueue = new Queue('ocr', { connection });
    }
  }

  async upload(companyId: string, fileUrl: string) {
    const isDemo = (process.env.DEMO_MODE ?? 'true') !== 'false';
    if (isDemo) {
      return { id: 'demo-expense', companyId, fileUrl } as any;
    }
    const expense = await this.prisma.expense.create({ data: { companyId, fileUrl } });
    await this.ocrQueue.add('scan', { expenseId: expense.id, fileUrl, companyId });
    return expense;
  }
}


