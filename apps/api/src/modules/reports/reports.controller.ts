import { Body, Controller, Post, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reports: ReportsService) {}

  @Post('generate')
  generate(@Req() req: any, @Body() body: { type: string }) {
    return this.reports.generate(req.tenantId, body.type);
  }
}


