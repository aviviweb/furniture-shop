import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  list(@Req() req: any, @Query() query: { onlyAvailable?: string }) {
    return this.products.list(req.tenantId, {
      onlyAvailable: query.onlyAvailable === 'true',
    });
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: {
      name: string;
      description?: string;
      imageUrl?: string;
      variants?: {
        sku: string;
        price: number;
        stock?: number;
        imageUrl?: string;
        vatRate?: number;
      }[];
    },
  ) {
    return this.products.create(req.tenantId, body);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; imageUrl?: string },
  ) {
    return this.products.update(req.tenantId, id, body);
  }

  @Patch(':productId/variants/:variantId')
  updateVariant(
    @Req() req: any,
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
    @Body() body: {
      sku?: string;
      price?: number;
      stock?: number;
      imageUrl?: string;
      vatRate?: number;
    },
  ) {
    return this.products.updateVariant(req.tenantId, productId, variantId, body);
  }
}


