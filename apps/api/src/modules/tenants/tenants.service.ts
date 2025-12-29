import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async getCompanyByTenant(tenantId: string) {
    const isDemo = isDemoMode();
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
    const isDemo = isDemoMode();
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

  async getSettings(tenantId: string) {
    const isDemo = isDemoMode();
    if (isDemo) {
      return {
        id: 'settings-demo',
        companyId: 'demo-company',
        defaultVatRate: 0.17,
        baseShippingCost: 50,
        shippingCostPerKm: 2,
        shippingCostPerFloor: 10,
        baseAssemblyCost: 100,
      };
    }

    const company = await this.prisma.company.findUnique({ where: { tenantId } });
    if (!company) throw new Error('Company not found');

    let settings = await this.prisma.companySettings.findUnique({
      where: { companyId: company.id },
    });

    if (!settings) {
      // Create default settings
      settings = await this.prisma.companySettings.create({
        data: {
          companyId: company.id,
          defaultVatRate: 0.17,
          baseShippingCost: 50,
          shippingCostPerKm: 2,
          shippingCostPerFloor: 10,
          baseAssemblyCost: 100,
        },
      });
    }

    return settings;
  }

  async updateSettings(tenantId: string, data: {
    defaultVatRate?: number;
    baseShippingCost?: number;
    shippingCostPerKm?: number;
    shippingCostPerFloor?: number;
    baseAssemblyCost?: number;
  }) {
    const isDemo = isDemoMode();
    if (isDemo) {
      return {
        id: 'settings-demo',
        companyId: 'demo-company',
        ...data,
      };
    }

    const company = await this.prisma.company.findUnique({ where: { tenantId } });
    if (!company) throw new Error('Company not found');

    return this.prisma.companySettings.upsert({
      where: { companyId: company.id },
      create: {
        companyId: company.id,
        defaultVatRate: data.defaultVatRate ?? 0.17,
        baseShippingCost: data.baseShippingCost ?? 50,
        shippingCostPerKm: data.shippingCostPerKm ?? 2,
        shippingCostPerFloor: data.shippingCostPerFloor ?? 10,
        baseAssemblyCost: data.baseAssemblyCost ?? 100,
      },
      update: data,
    });
  }
}


