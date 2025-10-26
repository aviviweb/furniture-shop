import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, items: { variantId: string; qty: number; price: number }[]) {
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    const isDemo = (process.env.DEMO_MODE ?? 'true') !== 'false';
    if (isDemo) {
      return {
        id: `ord-demo-${Date.now()}`,
        companyId: companyId || 'demo-company',
        total,
        createdAt: new Date(),
      } as any;
    }
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({ data: { companyId, total } });
      for (const i of items) {
        await tx.orderItem.create({ data: { orderId: order.id, variantId: i.variantId, qty: i.qty, price: i.price } });
        await tx.productVariant.update({ where: { id: i.variantId }, data: { stock: { decrement: i.qty } } });
      }
      return order;
    });
  }
}


