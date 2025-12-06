import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private inventory: InventoryService) {}

  @Get()
  list(@Req() req: any, @Query() query: { lowStock?: string; location?: string }) {
    return this.inventory.list(req.tenantId, {
      lowStock: query.lowStock === 'true',
      location: query.location,
    });
  }

  @Get('low-stock')
  getLowStock(@Req() req: any) {
    return this.inventory.getLowStockItems(req.tenantId);
  }

  @Get('movements')
  getMovements(@Req() req: any, @Query() query: { variantId?: string; limit?: string }) {
    return this.inventory.getMovements(
      req.tenantId,
      query.variantId,
      query.limit ? parseInt(query.limit) : 100,
    );
  }

  @Get(':variantId')
  getByVariantId(@Req() req: any, @Param('variantId') variantId: string) {
    return this.inventory.getByVariantId(req.tenantId, variantId);
  }

  @Patch(':variantId')
  update(
    @Req() req: any,
    @Param('variantId') variantId: string,
    @Body() body: { quantity?: number; minThreshold?: number; location?: string },
  ) {
    return this.inventory.update(req.tenantId, variantId, body, req.user?.id);
  }

  @Post(':variantId/movements')
  addMovement(
    @Req() req: any,
    @Param('variantId') variantId: string,
    @Body() body: {
      type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';
      quantity: number;
      reason?: string;
      referenceId?: string;
      referenceType?: string;
    },
  ) {
    return this.inventory.addMovement(req.tenantId, variantId, body, req.user?.id);
  }
}

