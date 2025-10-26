import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  list(companyId: string) {
    const demoList = (() => {
      const now = new Date();
      return [
        {
          id: 'demo-product',
          companyId: 'demo-company',
          name: 'ספת בד מודולרית',
          description: 'ספה נוחה ואיכותית',
          createdAt: now,
          updatedAt: now,
          variants: [
            { id: 'var-demo', productId: 'demo-product', sku: 'PRD-001', price: 2990, stock: 10 },
          ],
        },
      ] as any;
    })();

    const isDemo = (process.env.DEMO_MODE ?? 'true') !== 'false';
    if (isDemo) return demoList;

    return this.prisma.product
      .findMany({ where: { companyId }, include: { variants: true } })
      .catch(() => demoList);
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


