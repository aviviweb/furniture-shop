import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async getCompanyByTenant(tenantId: string) {
    const isDemo = (process.env.DEMO_MODE ?? 'true') !== 'false';
    if (isDemo) {
      return {
        id: 'demo-company',
        tenantId,
        name: 'Furniture Demo Ltd',
        currency: 'ILS',
        demoMode: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: {
          id: 'demo-brand',
          companyId: 'demo-company',
          primaryColor: '#0ea5e9',
          secondaryColor: '#10b981',
          logoUrl: null,
          domain: null,
          website: null,
          facebook: null,
          instagram: null,
          whatsapp: null,
          linkedin: null,
        },
      } as any;
    }
    return this.prisma.company.findUnique({ where: { tenantId }, include: { brand: true } });
  }

  async updateBranding(tenantId: string, data: any) {
    const isDemo = (process.env.DEMO_MODE ?? 'true') !== 'false';
    if (isDemo) {
      return { ok: true, message: 'Demo mode - saved to localStorage' };
    }
    const company = await this.prisma.company.findUnique({ where: { tenantId } });
    if (!company) throw new Error('Company not found');
    
    await this.prisma.brandSettings.upsert({
      where: { companyId: company.id },
      create: { ...data, companyId: company.id },
      update: data,
    });
    
    return { ok: true };
  }
}


