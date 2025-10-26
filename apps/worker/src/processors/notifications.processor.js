import { Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

new Worker('notifications', async (job) => {
  const { channel, target, payload } = job.data;
  console.log(`[notifications] ${channel} -> ${target}`, payload);
  return { ok: true };
}, { connection });


