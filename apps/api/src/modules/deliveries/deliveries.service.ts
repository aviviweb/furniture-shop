import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async list(companyId: string, filters?: { status?: string; dateFrom?: Date; dateTo?: Date }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return [
        {
          id: 'del-demo-1',
          orderId: 'ord-demo-1',
          scheduledAt: new Date(),
          status: 'scheduled',
          driverName: 'דני נהג',
          installerName: 'יוסי מתקין',
          customerName: 'ישראל ישראלי',
          customerAddress: 'רחוב הרצל 15, תל אביב',
          total: 5000,
        },
        {
          id: 'del-demo-2',
          orderId: 'ord-demo-2',
          scheduledAt: new Date(Date.now() + 86400000),
          status: 'in_transit',
          driverName: 'משה נהג',
          installerName: 'שרה מתקינה',
          customerName: 'שרה כהן',
          customerAddress: 'רחוב דיזנגוף 20, תל אביב',
          total: 3000,
        },
      ];
    }

    const where: any = { companyId };
    
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.dateFrom || filters?.dateTo) {
      where.scheduledAt = {};
      if (filters.dateFrom) {
        where.scheduledAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.scheduledAt.lte = filters.dateTo;
      }
    }

    const deliveries = await this.prisma.delivery.findMany({
      where,
      include: {
        Order: {
          include: {
            Customer: true,
            items: {
              include: {
                Variant: {
                  include: {
                    Product: true,
                  },
                },
              },
            },
          },
        },
        installation: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return deliveries.map(del => ({
      id: del.id,
      orderId: del.orderId,
      scheduledAt: del.scheduledAt,
      status: del.status,
      driverName: del.driverName,
      installerName: del.installerName,
      customerName: del.Order.Customer?.name,
      customerAddress: del.Order.Customer?.address,
      customerPhone: del.Order.Customer?.phone,
      total: del.Order.total,
      items: del.Order.items.map(item => ({
        name: item.Variant.Product.name,
        sku: item.Variant.sku,
        qty: item.qty,
      })),
      hasInstallation: !!del.installation,
      installationId: del.installation?.id,
    }));
  }

  async getById(companyId: string, id: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: 'del-demo-1',
        orderId: 'ord-demo-1',
        scheduledAt: new Date(),
        status: 'scheduled',
        driverName: 'דני נהג',
        installerName: 'יוסי מתקין',
        customerName: 'ישראל ישראלי',
        customerAddress: 'רחוב הרצל 15, תל אביב',
        customerPhone: '050-1234567',
        total: 5000,
        items: [
          { name: 'ספה 3 מושבים', sku: 'SKU-001', qty: 1 },
        ],
      };
    }

    const delivery = await this.prisma.delivery.findFirst({
      where: { companyId, id },
      include: {
        Order: {
          include: {
            Customer: true,
            items: {
              include: {
                Variant: {
                  include: {
                    Product: true,
                  },
                },
              },
            },
          },
        },
        installation: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return {
      id: delivery.id,
      orderId: delivery.orderId,
      scheduledAt: delivery.scheduledAt,
      status: delivery.status,
      driverName: delivery.driverName,
      installerName: delivery.installerName,
      customerName: delivery.Order.Customer?.name,
      customerAddress: delivery.Order.Customer?.address,
      customerPhone: delivery.Order.Customer?.phone,
      total: delivery.Order.total,
      items: delivery.Order.items.map(item => ({
        name: item.Variant.Product.name,
        sku: item.Variant.sku,
        qty: item.qty,
      })),
      installation: delivery.installation,
    };
  }

  async updateStatus(companyId: string, id: string, data: { status: string; driverName?: string; installerName?: string }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id,
        ...data,
        updatedAt: new Date(),
      };
    }

    const delivery = await this.prisma.delivery.findFirst({
      where: { companyId, id },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return this.prisma.delivery.update({
      where: { id },
      data: {
        status: data.status,
        driverName: data.driverName,
        installerName: data.installerName,
      },
    });
  }

  async optimize(companyId: string, stops: { lat: number; lng: number; id: string }[]) {
    // mock TSP: return same order with simple distance heuristic
    const route = stops.slice().sort((a, b) => (a.lat + a.lng) - (b.lat + b.lng));
    return { route, provider: process.env.GOOGLE_MAPS_API_KEY ? 'google' : 'mock' };
  }

  async getUpcoming(companyId: string, days = 7) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return [
        {
          id: 'del-demo-1',
          scheduledAt: new Date(),
          customerName: 'ישראל ישראלי',
          status: 'scheduled',
        },
      ];
    }

    const dateFrom = new Date();
    const dateTo = new Date();
    dateTo.setDate(dateTo.getDate() + days);

    return this.prisma.delivery.findMany({
      where: {
        companyId,
        scheduledAt: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      include: {
        Order: {
          include: {
            Customer: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }
}
