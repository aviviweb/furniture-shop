import { Body, Controller, Post, Req } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private invoices: InvoicesService) {}

  @Post()
  async create(@Req() req: any, @Body() body: { items: { description: string; qty: number; unitPrice: number }[]; type: 'TAX'|'TAX_RECEIPT'|'PROFORMA'|'CREDIT'; buyerVatNumber?: string; allocationNumber?: string; vatRate?: number; currency?: string; }) {
    const companyId = req.companyId || req.tenantId || (req.user?.tenantId ? req.user.tenantId : undefined);
    try {
      const invoice = await this.invoices.createInvoice({ companyId, ...body });
      return invoice;
    } catch (e: any) {
      const isDemo = (process.env.DEMO_MODE ?? 'true') !== 'false';
      if (isDemo) {
        // surface error details in demo to speed debugging
        return { error: e?.message || String(e), stack: e?.stack || null } as any;
      }
      throw e;
    }
  }
}


