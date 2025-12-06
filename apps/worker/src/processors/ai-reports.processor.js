import { Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // Required by BullMQ
});

new Worker('ai-reports', async (job) => {
  const { reportType, companyId } = job.data;
  // Mock generation
  const content = `דוח ${reportType} (דמו) לחברה ${companyId}`;
  console.log('[ai-reports] generated', content);
  return { content };
}, { connection });


