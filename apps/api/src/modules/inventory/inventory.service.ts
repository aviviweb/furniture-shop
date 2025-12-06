import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async list(companyId: string, filters?: { lowStock?: boolean; location?: string }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return [
        {
          id: 'inv-demo-1',
          variantId: 'var-demo-1',
          sku: 'SKU-001',
          productName: 'ספה 3 מושבים',
          quantity: 5,
          minThreshold: 10,
          location: 'מחסן א',
          status: 'low',
          updatedAt: new Date(),
        },
        {
          id: 'inv-demo-2',
          variantId: 'var-demo-2',
          sku: 'SKU-002',
          productName: 'כורסה',
          quantity: 15,
          minThreshold: 10,
          location: 'מחסן ב',
          status: 'ok',
          updatedAt: new Date(),
        },
      ];
    }

    const where: any = { companyId };
    
    const inventories = await this.prisma.inventory.findMany({
      where,
      include: {
        Variant: {
          include: {
            Product: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    let result = inventories.map(inv => ({
      id: inv.id,
      variantId: inv.variantId,
      sku: inv.Variant.sku,
      productName: inv.Variant.Product.name,
      quantity: inv.quantity,
      minThreshold: inv.minThreshold,
      location: inv.location,
      status: inv.quantity <= inv.minThreshold ? 'low' : 'ok',
      updatedAt: inv.updatedAt,
    }));

    if (filters?.lowStock) {
      result = result.filter(item => item.status === 'low');
    }
    if (filters?.location) {
      result = result.filter(item => item.location === filters.location);
    }

    return result;
  }

  async getByVariantId(companyId: string, variantId: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: 'inv-demo-1',
        variantId,
        sku: 'SKU-001',
        productName: 'ספה 3 מושבים',
        quantity: 5,
        minThreshold: 10,
        location: 'מחסן א',
        status: 'low',
        movements: [],
      };
    }

    const inventory = await this.prisma.inventory.findFirst({
      where: { companyId, variantId },
      include: {
        Variant: {
          include: {
            Product: true,
            inventoryMovements: {
              orderBy: { createdAt: 'desc' },
              take: 50,
            },
          },
        },
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return {
      id: inventory.id,
      variantId: inventory.variantId,
      sku: inventory.Variant.sku,
      productName: inventory.Variant.Product.name,
      quantity: inventory.quantity,
      minThreshold: inventory.minThreshold,
      location: inventory.location,
      status: inventory.quantity <= inventory.minThreshold ? 'low' : 'ok',
      movements: inventory.Variant.inventoryMovements,
    };
  }

  async update(
    companyId: string,
    variantId: string,
    data: { quantity?: number; minThreshold?: number; location?: string },
    userId?: string,
  ) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: 'inv-demo-1',
        variantId,
        ...data,
        updatedAt: new Date(),
      };
    }

    return this.prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.findFirst({
        where: { companyId, variantId },
      });

      if (!inventory) {
        throw new NotFoundException('Inventory not found');
      }

      const previousQty = inventory.quantity;
      const newQty = data.quantity !== undefined ? data.quantity : inventory.quantity;

      // Create movement record if quantity changed
      if (data.quantity !== undefined && data.quantity !== previousQty) {
        await tx.inventoryMovement.create({
          data: {
            companyId,
            variantId,
            type: 'ADJUSTMENT',
            quantity: newQty - previousQty,
            previousQty,
            newQty,
            reason: 'Manual adjustment',
            referenceType: 'MANUAL',
            createdBy: userId || 'system',
          },
        });
      }

      const updated = await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: data.quantity !== undefined ? data.quantity : inventory.quantity,
          minThreshold: data.minThreshold !== undefined ? data.minThreshold : inventory.minThreshold,
          location: data.location !== undefined ? data.location : inventory.location,
        },
        include: {
          Variant: {
            include: {
              Product: true,
            },
          },
        },
      });

      return {
        id: updated.id,
        variantId: updated.variantId,
        sku: updated.Variant.sku,
        productName: updated.Variant.Product.name,
        quantity: updated.quantity,
        minThreshold: updated.minThreshold,
        location: updated.location,
        status: updated.quantity <= updated.minThreshold ? 'low' : 'ok',
        updatedAt: updated.updatedAt,
      };
    });
  }

  async addMovement(
    companyId: string,
    variantId: string,
    data: {
      type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';
      quantity: number;
      reason?: string;
      referenceId?: string;
      referenceType?: string;
    },
    userId?: string,
  ) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: 'mov-demo-1',
        ...data,
        createdAt: new Date(),
      };
    }

    return this.prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.findFirst({
        where: { companyId, variantId },
      });

      if (!inventory) {
        throw new NotFoundException('Inventory not found');
      }

      const previousQty = inventory.quantity;
      let newQty = previousQty;

      if (data.type === 'IN' || data.type === 'RETURN') {
        newQty = previousQty + Math.abs(data.quantity);
      } else if (data.type === 'OUT') {
        newQty = previousQty - Math.abs(data.quantity);
        if (newQty < 0) {
          throw new BadRequestException('Insufficient stock');
        }
      } else if (data.type === 'ADJUSTMENT') {
        newQty = data.quantity;
      }

      const movement = await tx.inventoryMovement.create({
        data: {
          companyId,
          variantId,
          type: data.type,
          quantity: data.type === 'OUT' ? -Math.abs(data.quantity) : Math.abs(data.quantity),
          previousQty,
          newQty,
          reason: data.reason,
          referenceId: data.referenceId,
          referenceType: data.referenceType,
          createdBy: userId || 'system',
        },
      });

      await tx.inventory.update({
        where: { id: inventory.id },
        data: { quantity: newQty },
      });

      return movement;
    });
  }

  async getMovements(companyId: string, variantId?: string, limit = 100) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return [
        {
          id: 'mov-demo-1',
          type: 'OUT',
          quantity: -2,
          previousQty: 7,
          newQty: 5,
          reason: 'Order #123',
          createdAt: new Date(),
        },
      ];
    }

    const where: any = { companyId };
    if (variantId) {
      where.variantId = variantId;
    }

    return this.prisma.inventoryMovement.findMany({
      where,
      include: {
        Variant: {
          include: {
            Product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getLowStockItems(companyId: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return [
        {
          id: 'inv-demo-1',
          sku: 'SKU-001',
          productName: 'ספה 3 מושבים',
          quantity: 5,
          minThreshold: 10,
          status: 'low',
        },
      ];
    }

    const inventories = await this.prisma.inventory.findMany({
      where: {
        companyId,
      },
      include: {
        Variant: {
          include: {
            Product: true,
          },
        },
      },
    });

    // Filter items where quantity <= minThreshold
    const lowStockItems = inventories.filter(inv => inv.quantity <= inv.minThreshold);

    return lowStockItems.map(inv => ({
      id: inv.id,
      sku: inv.Variant.sku,
      productName: inv.Variant.Product.name,
      quantity: inv.quantity,
      minThreshold: inv.minThreshold,
      status: 'low',
    }));
  }
}

