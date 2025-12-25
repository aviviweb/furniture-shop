import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { isDemoMode } from '../shared/demo-mode';

@Injectable()
export class ExpensesService {
  private ocrQueue: Queue | null = null;
  constructor(private prisma: PrismaService) {
    const isDemo = isDemoMode();
    if (!isDemo && process.env.REDIS_URL) {
      try {
        const connection = new IORedis(process.env.REDIS_URL, {
          maxRetriesPerRequest: null,
        });
        this.ocrQueue = new Queue('ocr', { connection });
      } catch (error) {
        console.error('Failed to initialize OCR queue:', error);
        // Continue without OCR queue - expenses will be created but not processed
      }
    }
  }

  async upload(companyId: string, fileUrl: string) {
    if (!fileUrl || typeof fileUrl !== 'string' || fileUrl.trim().length === 0) {
      throw new BadRequestException('fileUrl is required and must be a non-empty string');
    }
    
    const isDemo = isDemoMode();
    if (isDemo) {
      return { id: 'demo-expense', companyId, fileUrl } as any;
    }
    
    const expense = await this.prisma.expense.create({ data: { companyId, fileUrl } });
    
    // Add to OCR queue if available
    if (this.ocrQueue) {
      try {
        await this.ocrQueue.add('scan', { expenseId: expense.id, fileUrl, companyId });
      } catch (error) {
        console.error('Failed to add expense to OCR queue:', error);
        // Don't fail the request - expense is created, just OCR won't run
      }
    } else {
      console.warn('OCR queue not available - expense created but OCR processing skipped');
    }
    
    return expense;
  }
}


