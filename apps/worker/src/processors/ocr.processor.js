import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const prisma = new PrismaClient();

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
  const parsedRow = await prisma.invoiceParsedFields.create({
    data: { invoiceId: undefined, rawText, merchantName: parsed.merchantName, vatNumber: parsed.vatNumber, total: parsed.total },
  }).catch(() => null);
  await prisma.expense.update({
    where: { id: expenseId },
    data: { category: parsed.category, amount: parsed.total, vatAmount: 0, parsedId: parsedRow?.id },
  });
}, { connection });


