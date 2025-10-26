import { Body, Controller, Post, Req } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private deliveries: DeliveriesService) {}

  @Post('optimize')
  optimize(@Req() req: any, @Body() body: { stops: { lat: number; lng: number; id: string }[] }) {
    return this.deliveries.optimize(req.tenantId, body.stops);
  }
}


