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
        },
      } as any;
    }
    return this.prisma.company.findUnique({ where: { tenantId }, include: { brand: true } });
  }
}


