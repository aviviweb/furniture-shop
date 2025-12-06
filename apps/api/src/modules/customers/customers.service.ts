import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async list(companyId: string, filters?: { search?: string }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return [
        {
          id: 'cust-demo-1',
          name: 'ישראל ישראלי',
          email: 'israel@example.com',
          phone: '050-1234567',
          address: 'רחוב הרצל 15',
          city: 'תל אביב',
          zipCode: '61000',
          vatNumber: '123456789',
          ordersCount: 5,
          totalSpent: 15000,
          lastOrderDate: new Date(),
        },
        {
          id: 'cust-demo-2',
          name: 'שרה כהן',
          email: 'sara@example.com',
          phone: '052-9876543',
          address: 'רחוב דיזנגוף 20',
          city: 'תל אביב',
          zipCode: '61001',
          ordersCount: 3,
          totalSpent: 8500,
          lastOrderDate: new Date(Date.now() - 86400000),
        },
      ];
    }

    const where: any = { companyId };
    
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const customers = await this.prisma.customer.findMany({
      where,
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return customers.map(customer => {
      const ordersCount = customer.orders.length;
      const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.total), 0);
      const lastOrder = customer.orders[0];

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        zipCode: customer.zipCode,
        vatNumber: customer.vatNumber,
        notes: customer.notes,
        ordersCount,
        totalSpent,
        lastOrderDate: lastOrder?.createdAt || null,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      };
    });
  }

  async getById(companyId: string, id: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: 'cust-demo-1',
        name: 'ישראל ישראלי',
        email: 'israel@example.com',
        phone: '050-1234567',
        address: 'רחוב הרצל 15',
        city: 'תל אביב',
        zipCode: '61000',
        vatNumber: '123456789',
        notes: 'לקוח VIP',
        orders: [
          {
            id: 'ord-demo-1',
            total: 5000,
            status: 'completed',
            createdAt: new Date(),
          },
        ],
        totalSpent: 15000,
        ordersCount: 5,
      };
    }

    const customer = await this.prisma.customer.findFirst({
      where: { companyId, id },
      include: {
        orders: {
          include: {
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
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.total), 0);

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      zipCode: customer.zipCode,
      vatNumber: customer.vatNumber,
      notes: customer.notes,
      orders: customer.orders,
      totalSpent,
      ordersCount: customer.orders.length,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  async create(companyId: string, data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    vatNumber?: string;
    notes?: string;
  }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: `cust-demo-${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return this.prisma.customer.create({
      data: {
        companyId,
        ...data,
      },
    });
  }

  async update(companyId: string, id: string, data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    vatNumber?: string;
    notes?: string;
  }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id,
        ...data,
        updatedAt: new Date(),
      };
    }

    const customer = await this.prisma.customer.findFirst({
      where: { companyId, id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async delete(companyId: string, id: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return { id, deleted: true };
    }

    const customer = await this.prisma.customer.findFirst({
      where: { companyId, id },
      include: {
        orders: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (customer.orders.length > 0) {
      throw new Error('Cannot delete customer with existing orders');
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async getStats(companyId: string, customerId: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        totalOrders: 5,
        totalSpent: 15000,
        averageOrderValue: 3000,
        lastOrderDate: new Date(),
        favoriteProducts: ['ספה 3 מושבים', 'כורסה'],
      };
    }

    const customer = await this.prisma.customer.findFirst({
      where: { companyId, id: customerId },
      include: {
        orders: {
          include: {
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
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const totalOrders = customer.orders.length;
    const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const lastOrder = customer.orders[0];

    // Count product popularity
    const productCounts = new Map<string, number>();
    customer.orders.forEach(order => {
      order.items.forEach(item => {
        const productName = item.Variant.Product.name;
        productCounts.set(productName, (productCounts.get(productName) || 0) + item.qty);
      });
    });

    const favoriteProducts = Array.from(productCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      lastOrderDate: lastOrder?.createdAt || null,
      favoriteProducts,
    };
  }
}

