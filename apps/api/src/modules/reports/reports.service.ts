import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generate(companyId: string, reportType: string, filters?: { dateFrom?: Date; dateTo?: Date }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      // Demo data
      if (reportType === 'sales') {
        return {
          type: 'sales',
          period: { from: filters?.dateFrom || new Date(), to: filters?.dateTo || new Date() },
          summary: {
            totalOrders: 25,
            totalRevenue: 125000,
            averageOrderValue: 5000,
            topProducts: [
              { name: 'ספה 3 מושבים', quantity: 15, revenue: 45000 },
              { name: 'כורסה', quantity: 20, revenue: 30000 },
            ],
          },
          monthly: Array.from({ length: 6 }).map((_, i) => ({
            month: new Date(2024, i, 1).toLocaleString('he-IL', { month: 'long' }),
            orders: Math.round(20 + Math.random() * 10),
            revenue: Math.round(80000 + Math.random() * 40000),
          })),
        };
      }
      if (reportType === 'inventory') {
        return {
          type: 'inventory',
          summary: {
            totalItems: 45,
            lowStockItems: 8,
            totalValue: 250000,
          },
          byLocation: [
            { location: 'מחסן א', items: 20, value: 120000 },
            { location: 'מחסן ב', items: 25, value: 130000 },
          ],
          lowStock: [
            { sku: 'SKU-001', name: 'ספה 3 מושבים', quantity: 5, minThreshold: 10 },
            { sku: 'SKU-002', name: 'כורסה', quantity: 8, minThreshold: 10 },
          ],
        };
      }
      if (reportType === 'finance') {
        return {
          type: 'finance',
          period: { from: filters?.dateFrom || new Date(), to: filters?.dateTo || new Date() },
          summary: {
            totalRevenue: 125000,
            totalExpenses: 45000,
            profit: 80000,
            profitMargin: 64,
          },
          revenue: Array.from({ length: 6 }).map((_, i) => ({
            month: new Date(2024, i, 1).toLocaleString('he-IL', { month: 'long' }),
            revenue: Math.round(15000 + Math.random() * 10000),
            expenses: Math.round(5000 + Math.random() * 3000),
          })),
        };
      }
      return { type: reportType, message: 'Demo report' };
    }

    // Real reports from database
    const dateFrom = filters?.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dateTo = filters?.dateTo || new Date();

    if (reportType === 'sales') {
      const orders = await this.prisma.order.findMany({
        where: {
          companyId,
          createdAt: {
            gte: dateFrom,
            lte: dateTo,
          },
        },
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
      });

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Top products
      const productCounts = new Map<string, { name: string; quantity: number; revenue: number }>();
      orders.forEach(order => {
        order.items.forEach(item => {
          const productName = item.Variant.Product.name;
          const existing = productCounts.get(productName) || { name: productName, quantity: 0, revenue: 0 };
          existing.quantity += item.qty;
          existing.revenue += Number(item.price) * item.qty;
          productCounts.set(productName, existing);
        });
      });

      const topProducts = Array.from(productCounts.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Monthly breakdown
      const monthly = new Map<string, { orders: number; revenue: number }>();
      orders.forEach(order => {
        const monthKey = order.createdAt.toLocaleString('he-IL', { month: 'long', year: 'numeric' });
        const existing = monthly.get(monthKey) || { orders: 0, revenue: 0 };
        existing.orders += 1;
        existing.revenue += Number(order.total);
        monthly.set(monthKey, existing);
      });

      return {
        type: 'sales',
        period: { from: dateFrom, to: dateTo },
        summary: {
          totalOrders,
          totalRevenue,
          averageOrderValue,
          topProducts,
        },
        monthly: Array.from(monthly.entries()).map(([month, data]) => ({
          month,
          orders: data.orders,
          revenue: data.revenue,
        })),
      };
    }

    if (reportType === 'inventory') {
      const inventories = await this.prisma.inventory.findMany({
        where: { companyId },
        include: {
          Variant: {
            include: {
              Product: true,
            },
          },
        },
      });

      const totalItems = inventories.length;
      const lowStockItems = inventories.filter(inv => inv.quantity <= inv.minThreshold).length;
      const totalValue = inventories.reduce((sum, inv) => {
        return sum + (inv.quantity * Number(inv.Variant.price));
      }, 0);

      // By location
      const byLocation = new Map<string, { items: number; value: number }>();
      inventories.forEach(inv => {
        const location = inv.location || 'ללא מיקום';
        const existing = byLocation.get(location) || { items: 0, value: 0 };
        existing.items += 1;
        existing.value += inv.quantity * Number(inv.Variant.price);
        byLocation.set(location, existing);
      });

      const lowStock = inventories
        .filter(inv => inv.quantity <= inv.minThreshold)
        .map(inv => ({
          sku: inv.Variant.sku,
          name: inv.Variant.Product.name,
          quantity: inv.quantity,
          minThreshold: inv.minThreshold,
        }));

      return {
        type: 'inventory',
        summary: {
          totalItems,
          lowStockItems,
          totalValue,
        },
        byLocation: Array.from(byLocation.entries()).map(([location, data]) => ({
          location,
          items: data.items,
          value: data.value,
        })),
        lowStock,
      };
    }

    if (reportType === 'finance') {
      const orders = await this.prisma.order.findMany({
        where: {
          companyId,
          createdAt: {
            gte: dateFrom,
            lte: dateTo,
          },
        },
      });

      const expenses = await this.prisma.expense.findMany({
        where: {
          companyId,
          occurredAt: {
            gte: dateFrom,
            lte: dateTo,
          },
        },
      });

      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
      const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
      const profit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      // Monthly breakdown
      const monthly = new Map<string, { revenue: number; expenses: number }>();
      orders.forEach(order => {
        const monthKey = order.createdAt.toLocaleString('he-IL', { month: 'long', year: 'numeric' });
        const existing = monthly.get(monthKey) || { revenue: 0, expenses: 0 };
        existing.revenue += Number(order.total);
        monthly.set(monthKey, existing);
      });
      expenses.forEach(exp => {
        const monthKey = exp.occurredAt.toLocaleString('he-IL', { month: 'long', year: 'numeric' });
        const existing = monthly.get(monthKey) || { revenue: 0, expenses: 0 };
        existing.expenses += Number(exp.amount || 0);
        monthly.set(monthKey, existing);
      });

      return {
        type: 'finance',
        period: { from: dateFrom, to: dateTo },
        summary: {
          totalRevenue,
          totalExpenses,
          profit,
          profitMargin,
        },
        revenue: Array.from(monthly.entries()).map(([month, data]) => ({
          month,
          revenue: data.revenue,
          expenses: data.expenses,
        })),
      };
    }

    return { type: reportType, message: 'Unknown report type' };
  }
}
