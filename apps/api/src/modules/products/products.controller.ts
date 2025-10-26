import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  list(@Req() req: any) {
    return this.products.list(req.tenantId);
  }

  @Post()
  create(@Req() req: any, @Body() body: { name: string; description?: string; variants?: { sku: string; price: number; stock?: number }[] }) {
    return this.products.create(req.tenantId, body);
  }
}


