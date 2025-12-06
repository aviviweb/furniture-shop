import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

function round2(n: number) { return Math.round(n * 100) / 100; }

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async nextInvoiceNumber(companyId: string, type: 'TAX' | 'TAX_RECEIPT' | 'PROFORMA' | 'CREDIT') {
    const isDemo = isDemoMode();
    if (isDemo) {
      const key = `${companyId || 'demo-company'}:${type}`;
      const n = Number((global as any)[`seq_${key}`] || 0) + 1;
      (global as any)[`seq_${key}`] = n;
      return n;
    }
    const seq = await this.prisma.invoiceSequence.upsert({
      where: { companyId_type: { companyId, type } },
      create: { companyId, type, current: 1 },
      update: { current: { increment: 1 } },
    });
    return seq.current;
  }

  async createInvoice(params: { companyId?: string; items: { description: string; qty: number; unitPrice: number }[]; type: 'TAX'|'TAX_RECEIPT'|'PROFORMA'|'CREDIT'; buyerVatNumber?: string; allocationNumber?: string; vatRate?: number; currency?: string; }) {
    const companyId = params.companyId || 'demo-company';
    const items = Array.isArray(params.items) ? params.items : [];
    if (!params.type) throw new BadRequestException('type is required');
    if (items.length === 0) throw new BadRequestException('items is required');
    const vatRate = params.vatRate ?? 0.17;
    const subTotal = round2(items.reduce((s, i) => s + Number(i.qty || 0) * Number(i.unitPrice || 0), 0));
    const vat = round2(subTotal * vatRate);
    const total = round2(subTotal + vat);

    const THRESHOLD = 5000; // demo threshold; replace with legal value/config
    const needsAllocation = total > THRESHOLD;
    const allocation = params.allocationNumber || (needsAllocation ? `ALLOC-DEMO-${Date.now()}` : null);

    if (needsAllocation && !allocation) throw new BadRequestException('allocationNumber required');

    if (isDemoMode()) {
      const number = await this.nextInvoiceNumber(companyId, params.type);
      return {
        id: `inv-demo-${Date.now()}`,
        companyId,
        type: params.type,
        invoiceNumber: number,
        buyerVatNumber: params.buyerVatNumber || null,
        vatRate,
        currency: params.currency || 'ILS',
        exchangeRate: 1,
        totalBeforeVat: subTotal,
        totalVat: vat,
        totalAfterVat: total,
        allocationNumber: allocation,
        createdBy: 'system',
        pdfUrl: `mock://pdf/${companyId}/${params.type}-${number}.pdf`,
        rawJsonUrl: `mock://json/${companyId}/${params.type}-${number}.json`,
      } as any;
    }
    return await this.prisma.$transaction(async (tx: PrismaClient) => {
      const number = await this.nextInvoiceNumber(companyId, params.type);
      const pdfUrl = `mock://pdf/${companyId}/${params.type}-${number}.pdf`;
      const rawJsonUrl = `mock://json/${companyId}/${params.type}-${number}.json`;
      const invoice = await (tx as any).invoice.create({
        data: {
          companyId,
          type: params.type,
          invoiceNumber: number,
          buyerVatNumber: params.buyerVatNumber || null,
          vatRate,
          currency: params.currency || 'ILS',
          exchangeRate: 1,
          totalBeforeVat: subTotal,
          totalVat: vat,
          totalAfterVat: total,
          allocationNumber: allocation,
          createdBy: 'system',
          pdfUrl,
          rawJsonUrl,
        },
      });
      // TODO: save invoice items table (omitted for brevity now)

      await (tx as any).auditLog.create({
        data: {
          companyId,
          actorId: 'system',
          action: 'INVOICE_CREATED',
          entity: 'Invoice',
          entityId: invoice.id,
          meta: { subTotal, vat, total, type: params.type },
        },
      });
      return invoice;
    }, { timeout: 10000 });
  }
}


