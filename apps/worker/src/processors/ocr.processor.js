import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // Required by BullMQ
});

// Initialize Prisma Client only if DATABASE_URL is available
let prisma = null;
if (process.env.DATABASE_URL) {
  try {
    prisma = new PrismaClient();
    console.log('[OCR Processor] Prisma Client initialized');
  } catch (error) {
    console.error('[OCR Processor] Failed to initialize Prisma Client:', error);
  }
} else {
  console.warn('[OCR Processor] DATABASE_URL not set, database operations will be skipped');
}

function mockExtract(text) {
  // naive mock classifier for demo
  return {
    merchantName: 'חנות דמו',
    vatNumber: '123456789',
    total: 123.45,
    category: 'ציוד משרדי',
    confidence: 0.9,
  };
}

new Worker('ocr', async (job) => {
  const { expenseId, fileUrl, companyId } = job.data;
  const rawText = `MOCK OCR FOR ${fileUrl}`;
  const parsed = mockExtract(rawText);
  
  if (!prisma) {
    console.log('[OCR Processor] Skipping database operations - Prisma Client not available');
    return { parsed, skipped: true };
  }
  
  try {
    const parsedRow = await prisma.invoiceParsedFields.create({
      data: { invoiceId: undefined, rawText, merchantName: parsed.merchantName, vatNumber: parsed.vatNumber, total: parsed.total },
    }).catch(() => null);
    
    if (expenseId) {
      await prisma.expense.update({
        where: { id: expenseId },
        data: { category: parsed.category, amount: parsed.total, vatAmount: 0, parsedId: parsedRow?.id },
      }).catch((err) => {
        console.error('[OCR Processor] Failed to update expense:', err);
      });
    }
    
    return { parsed, success: true };
  } catch (error) {
    console.error('[OCR Processor] Error processing job:', error);
    return { parsed, error: error.message };
  }
}, { connection });


