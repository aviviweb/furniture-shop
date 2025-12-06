import { Body, Controller, Post, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reports: ReportsService) {}

  @Post('generate')
  generate(
    @Req() req: any,
    @Body() body: {
      type: string;
      dateFrom?: string;
      dateTo?: string;
    },
  ) {
    return this.reports.generate(req.tenantId, body.type, {
      dateFrom: body.dateFrom ? new Date(body.dateFrom) : undefined,
      dateTo: body.dateTo ? new Date(body.dateTo) : undefined,
    });
  }
}


