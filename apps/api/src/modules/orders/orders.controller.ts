import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Get()
  list(@Req() req: any) {
    return this.orders.list(req.tenantId);
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: {
      items: { variantId: string; qty: number; price: number }[];
      shippingCosts?: {
        baseShippingCost?: number;
        shippingDistanceCost?: number;
        shippingFloorCost?: number;
        shippingComplexityCost?: number;
      };
      assemblyCosts?: {
        baseAssemblyCost?: number;
        assemblyComplexityCost?: number;
      };
    },
  ) {
    return this.orders.create(req.tenantId, body.items, body.shippingCosts, body.assemblyCosts);
  }
}


