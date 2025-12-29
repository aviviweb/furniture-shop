import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(
    companyId: string,
    items: { variantId: string; qty: number; price: number }[],
    shippingCosts?: {
      baseShippingCost?: number;
      shippingDistanceCost?: number;
      shippingFloorCost?: number;
      shippingComplexityCost?: number;
    },
    assemblyCosts?: {
      baseAssemblyCost?: number;
      assemblyComplexityCost?: number;
    },
  ) {
    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const itemsTotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    const shippingTotal = (shippingCosts?.baseShippingCost || 0) +
      (shippingCosts?.shippingDistanceCost || 0) +
      (shippingCosts?.shippingFloorCost || 0) +
      (shippingCosts?.shippingComplexityCost || 0);
    const assemblyTotal = (assemblyCosts?.baseAssemblyCost || 0) +
      (assemblyCosts?.assemblyComplexityCost || 0);
    const total = itemsTotal + shippingTotal + assemblyTotal;

    const isDemo = isDemoMode();
    if (isDemo) {
      return {
        id: `ord-demo-${Date.now()}`,
        companyId: companyId || 'demo-company',
        total,
        baseShippingCost: shippingCosts?.baseShippingCost || null,
        shippingDistanceCost: shippingCosts?.shippingDistanceCost || null,
        shippingFloorCost: shippingCosts?.shippingFloorCost || null,
        shippingComplexityCost: shippingCosts?.shippingComplexityCost || null,
        baseAssemblyCost: assemblyCosts?.baseAssemblyCost || null,
        assemblyComplexityCost: assemblyCosts?.assemblyComplexityCost || null,
        createdAt: new Date(),
      } as any;
    }
    
    return this.prisma.$transaction(async (tx) => {
      // Validate stock availability before creating order
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { Product: true },
        });
        
        if (!variant) {
          throw new NotFoundException(`Product variant ${item.variantId} not found`);
        }
        
        // Check if variant belongs to the company
        if (variant.Product.companyId !== companyId) {
          throw new BadRequestException(`Product variant ${item.variantId} does not belong to this company`);
        }
        
        // Check stock availability
        if (variant.stock < item.qty) {
          throw new BadRequestException(
            `Insufficient stock for ${variant.Product.name} (SKU: ${variant.sku}). Available: ${variant.stock}, Requested: ${item.qty}`
          );
        }
      }
      
      const order = await tx.order.create({
        data: {
          companyId,
          total,
          baseShippingCost: shippingCosts?.baseShippingCost || null,
          shippingDistanceCost: shippingCosts?.shippingDistanceCost || null,
          shippingFloorCost: shippingCosts?.shippingFloorCost || null,
          shippingComplexityCost: shippingCosts?.shippingComplexityCost || null,
          baseAssemblyCost: assemblyCosts?.baseAssemblyCost || null,
          assemblyComplexityCost: assemblyCosts?.assemblyComplexityCost || null,
        },
      });
      
      for (const i of items) {
        await tx.orderItem.create({ 
          data: { orderId: order.id, variantId: i.variantId, qty: i.qty, price: i.price } 
        });
        
        // Decrement stock - this will fail if stock becomes negative due to race condition
        const updated = await tx.productVariant.update({ 
          where: { id: i.variantId }, 
          data: { stock: { decrement: i.qty } },
        });
        
        // Double-check stock didn't go negative (race condition protection)
        if (updated.stock < 0) {
          throw new BadRequestException(`Stock became negative for variant ${i.variantId}. Transaction rolled back.`);
        }
      }
      
      return order;
    });
  }
}


