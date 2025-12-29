import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private deliveries: DeliveriesService) {}

  @Get()
  list(
    @Req() req: any,
    @Query() query: { status?: string; dateFrom?: string; dateTo?: string },
  ) {
    return this.deliveries.list(req.tenantId, {
      status: query.status,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    });
  }

  @Get('upcoming')
  getUpcoming(@Req() req: any, @Query() query: { days?: string }) {
    return this.deliveries.getUpcoming(req.tenantId, query.days ? parseInt(query.days) : 7);
  }

  @Get(':id')
  getById(@Req() req: any, @Param('id') id: string) {
    return this.deliveries.getById(req.tenantId, id);
  }

  @Patch(':id/status')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: string; driverName?: string; installerName?: string },
  ) {
    return this.deliveries.updateStatus(req.tenantId, id, body);
  }

  @Post('optimize')
  optimize(@Req() req: any, @Body() body: { stops: { lat: number; lng: number; id: string }[] }) {
    return this.deliveries.optimize(req.tenantId, body.stops);
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: {
      orderId: string;
      scheduledAt: string;
      driverName?: string;
      installerName?: string;
      baseShippingCost?: number;
      shippingDistanceCost?: number;
      shippingFloorCost?: number;
      shippingComplexityCost?: number;
      baseAssemblyCost?: number;
      assemblyComplexityCost?: number;
    },
  ) {
    return this.deliveries.create(req.tenantId, body.orderId, {
      scheduledAt: new Date(body.scheduledAt),
      driverName: body.driverName,
      installerName: body.installerName,
      baseShippingCost: body.baseShippingCost,
      shippingDistanceCost: body.shippingDistanceCost,
      shippingFloorCost: body.shippingFloorCost,
      shippingComplexityCost: body.shippingComplexityCost,
      baseAssemblyCost: body.baseAssemblyCost,
      assemblyComplexityCost: body.assemblyComplexityCost,
    });
  }
}
