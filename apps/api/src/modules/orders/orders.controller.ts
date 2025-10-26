import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() body: { items: { variantId: string; qty: number; price: number }[] }) {
    return this.orders.create(req.tenantId, body.items);
  }
}


