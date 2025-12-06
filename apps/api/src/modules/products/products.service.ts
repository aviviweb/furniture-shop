import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async list(companyId: string) {
    const isDemo = isDemoMode();
    
    // תמיד להשתמש ב-prisma - ב-demo mode זה יחזיר את ה-mock data
    return this.prisma.product
      .findMany({ where: { companyId }, include: { variants: true } });
  }

  async create(companyId: string, data: { name: string; description?: string; variants?: { sku: string; price: number; stock?: number }[] }) {
    return this.prisma.product.create({
      data: {
        companyId,
        name: data.name,
        description: data.description || null,
        variants: { create: (data.variants || []).map(v => ({ sku: v.sku, price: v.price, stock: v.stock ?? 0 })) },
      },
      include: { variants: true },
    });
  }
}


