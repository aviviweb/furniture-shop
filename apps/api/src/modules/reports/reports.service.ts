import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class ReportsService {
  private queue: Queue;
  constructor() {
    const isDemo = (process.env.DEMO_MODE ?? 'true') !== 'false';
    if (!isDemo) {
      const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
      this.queue = new Queue('ai-reports', { connection });
    }
  }

  async generate(companyId: string, reportType: string) {
    const isDemo = (process.env.DEMO_MODE ?? 'true') !== 'false';
    if (isDemo) {
      return { jobId: 'demo-job' };
    }
    const job = await this.queue.add('generate', { companyId, reportType });
    return { jobId: job.id };
  }
}


