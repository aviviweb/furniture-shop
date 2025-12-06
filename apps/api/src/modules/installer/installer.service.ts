import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Injectable()
export class InstallerService {
  constructor(private prisma: PrismaService) {}

  async list(companyId: string, filters?: { status?: string; dateFrom?: Date; dateTo?: Date }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return [
        {
          id: 'inst-demo-1',
          deliveryId: 'del-demo-1',
          orderId: 'ord-demo-1',
          scheduledAt: new Date(),
          status: 'scheduled',
          installerName: 'יוסי כהן',
          customerName: 'דני לוי',
          customerAddress: 'רחוב הרצל 15, תל אביב',
          customerPhone: '050-1234567',
          images: [],
        },
        {
          id: 'inst-demo-2',
          deliveryId: 'del-demo-2',
          orderId: 'ord-demo-2',
          scheduledAt: new Date(Date.now() + 86400000),
          status: 'in_progress',
          installerName: 'משה ישראלי',
          customerName: 'שרה כהן',
          customerAddress: 'רחוב דיזנגוף 20, תל אביב',
          customerPhone: '052-9876543',
          images: [],
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

    const installations = await this.prisma.installation.findMany({
      where,
      include: {
        Delivery: {
          include: {
            Order: {
              include: {
                Customer: true,
              },
            },
          },
        },
        images: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return installations.map(inst => ({
      id: inst.id,
      deliveryId: inst.deliveryId,
      orderId: inst.orderId,
      scheduledAt: inst.scheduledAt,
      status: inst.status,
      installerName: inst.installerName,
      installerPhone: inst.installerPhone,
      customerName: inst.customerName || inst.Delivery.Order.Customer?.name,
      customerPhone: inst.customerPhone || inst.Delivery.Order.Customer?.phone,
      customerAddress: inst.customerAddress || inst.Delivery.Order.Customer?.address,
      notes: inst.notes,
      completedAt: inst.completedAt,
      images: inst.images,
    }));
  }

  async getById(companyId: string, id: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: 'inst-demo-1',
        deliveryId: 'del-demo-1',
        orderId: 'ord-demo-1',
        scheduledAt: new Date(),
        status: 'scheduled',
        installerName: 'יוסי כהן',
        customerName: 'דני לוי',
        customerAddress: 'רחוב הרצל 15, תל אביב',
        customerPhone: '050-1234567',
        notes: '',
        images: [],
      };
    }

    const installation = await this.prisma.installation.findFirst({
      where: { companyId, id },
      include: {
        Delivery: {
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
          },
        },
        images: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    if (!installation) {
      throw new NotFoundException('Installation not found');
    }

    return {
      id: installation.id,
      deliveryId: installation.deliveryId,
      orderId: installation.orderId,
      scheduledAt: installation.scheduledAt,
      status: installation.status,
      installerName: installation.installerName,
      installerPhone: installation.installerPhone,
      customerName: installation.customerName || installation.Delivery.Order.Customer?.name,
      customerPhone: installation.customerPhone || installation.Delivery.Order.Customer?.phone,
      customerAddress: installation.customerAddress || installation.Delivery.Order.Customer?.address,
      notes: installation.notes,
      completedAt: installation.completedAt,
      images: installation.images,
      order: installation.Delivery.Order,
    };
  }

  async updateStatus(
    companyId: string,
    id: string,
    data: { status: string; notes?: string; installerName?: string; installerPhone?: string },
  ) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id,
        ...data,
        updatedAt: new Date(),
      };
    }

    const updateData: any = {
      status: data.status,
    };

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }
    if (data.installerName !== undefined) {
      updateData.installerName = data.installerName;
    }
    if (data.installerPhone !== undefined) {
      updateData.installerPhone = data.installerPhone;
    }
    if (data.status === 'completed') {
      updateData.completedAt = new Date();
    }

    return this.prisma.installation.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
      },
    });
  }

  async addImage(
    companyId: string,
    installationId: string,
    data: { url: string; type: 'before' | 'after' | 'other'; description?: string },
  ) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: 'img-demo-1',
        installationId,
        ...data,
        uploadedAt: new Date(),
      };
    }

    // Verify installation belongs to company
    const installation = await this.prisma.installation.findFirst({
      where: { companyId, id: installationId },
    });

    if (!installation) {
      throw new NotFoundException('Installation not found');
    }

    return this.prisma.installationImage.create({
      data: {
        installationId,
        url: data.url,
        type: data.type,
        description: data.description,
      },
    });
  }

  async getCalendar(companyId: string, month: number, year: number) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      const days: any[] = [];
      for (let day = 1; day <= 28; day++) {
        if (day % 7 === 0) {
          days.push({
            date: new Date(year, month - 1, day),
            installations: [
              {
                id: `inst-demo-${day}`,
                scheduledAt: new Date(year, month - 1, day, 10, 0),
                customerName: `לקוח ${day}`,
                status: 'scheduled',
              },
            ],
          });
        } else {
          days.push({
            date: new Date(year, month - 1, day),
            installations: [],
          });
        }
      }
      return days;
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const installations = await this.prisma.installation.findMany({
      where: {
        companyId,
        scheduledAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    // Group by date
    const byDate = new Map<string, any[]>();
    installations.forEach(inst => {
      const dateKey = inst.scheduledAt.toISOString().split('T')[0];
      if (!byDate.has(dateKey)) {
        byDate.set(dateKey, []);
      }
      byDate.get(dateKey)!.push({
        id: inst.id,
        scheduledAt: inst.scheduledAt,
        customerName: inst.customerName,
        status: inst.status,
      });
    });

    // Create array for all days in month
    const days: any[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateKey = date.toISOString().split('T')[0];
      days.push({
        date,
        installations: byDate.get(dateKey) || [],
      });
    }

    return days;
  }

  async createFromDelivery(companyId: string, deliveryId: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: 'inst-demo-new',
        deliveryId,
        status: 'scheduled',
      };
    }

    const delivery = await this.prisma.delivery.findFirst({
      where: { companyId, id: deliveryId },
      include: {
        Order: {
          include: {
            Customer: true,
          },
        },
      },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    // Check if installation already exists
    const existing = await this.prisma.installation.findFirst({
      where: { deliveryId },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.installation.create({
      data: {
        companyId,
        deliveryId,
        orderId: delivery.orderId,
        scheduledAt: delivery.scheduledAt,
        status: 'scheduled',
        installerName: delivery.installerName,
        customerName: delivery.Order.Customer?.name,
        customerPhone: delivery.Order.Customer?.phone,
        customerAddress: delivery.Order.Customer?.address,
      },
    });
  }
}

