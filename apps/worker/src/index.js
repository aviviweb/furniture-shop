import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

// Check required environment variables
if (!process.env.REDIS_URL) {
  console.error('ERROR: REDIS_URL environment variable is required');
  process.exit(1);
}

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
});

// bootstrap minimal queues so Railway can start the worker
export const ocrQueue = new Queue('ocr', { connection });
export const aiReportsQueue = new Queue('ai-reports', { connection });
export const notificationsQueue = new Queue('notifications', { connection });

// attach actual processor for OCR
new Worker('ocr', async (job) => { /* handled in processors/ocr.processor.js via side-effect import */ }, { connection });
new Worker('ai-reports', async () => { /* no-op */ }, { connection });
new Worker('notifications', async () => { /* no-op */ }, { connection });

console.log('Worker up with queues: ocr, ai-reports, notifications');
console.log('REDIS_URL:', process.env.REDIS_URL ? '✓ Set' : '✗ Missing');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '⚠ Not set (optional for some processors)');

try {
  await import('./processors/ocr.processor.js');
  await import('./processors/ai-reports.processor.js');
  await import('./processors/notifications.processor.js');
  console.log('All processors loaded successfully');
} catch (error) {
  console.error('Error loading processors:', error);
  process.exit(1);
}


