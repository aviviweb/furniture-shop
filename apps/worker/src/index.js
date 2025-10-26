import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

// bootstrap minimal queues so Railway can start the worker
export const ocrQueue = new Queue('ocr', { connection });
export const aiReportsQueue = new Queue('ai-reports', { connection });
export const notificationsQueue = new Queue('notifications', { connection });

// attach actual processor for OCR
new Worker('ocr', async (job) => { /* handled in processors/ocr.processor.js via side-effect import */ }, { connection });
new Worker('ai-reports', async () => { /* no-op */ }, { connection });
new Worker('notifications', async () => { /* no-op */ }, { connection });

console.log('Worker up with queues: ocr, ai-reports, notifications');
await import('./processors/ocr.processor.js');
await import('./processors/ai-reports.processor.js');
await import('./processors/notifications.processor.js');


