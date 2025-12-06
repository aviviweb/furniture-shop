import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { InstallerService } from './installer.service';

@Controller('installer')
export class InstallerController {
  constructor(private installer: InstallerService) {}

  @Get()
  list(
    @Req() req: any,
    @Query() query: { status?: string; dateFrom?: string; dateTo?: string },
  ) {
    return this.installer.list(req.tenantId, {
      status: query.status,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    });
  }

  @Get('calendar')
  getCalendar(
    @Req() req: any,
    @Query() query: { month?: string; year?: string },
  ) {
    const month = query.month ? parseInt(query.month) : new Date().getMonth() + 1;
    const year = query.year ? parseInt(query.year) : new Date().getFullYear();
    return this.installer.getCalendar(req.tenantId, month, year);
  }

  @Get(':id')
  getById(@Req() req: any, @Param('id') id: string) {
    return this.installer.getById(req.tenantId, id);
  }

  @Patch(':id/status')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string; installerName?: string; installerPhone?: string },
  ) {
    return this.installer.updateStatus(req.tenantId, id, body);
  }

  @Post(':id/images')
  addImage(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { url: string; type: 'before' | 'after' | 'other'; description?: string },
  ) {
    return this.installer.addImage(req.tenantId, id, body);
  }

  @Post('from-delivery/:deliveryId')
  createFromDelivery(@Req() req: any, @Param('deliveryId') deliveryId: string) {
    return this.installer.createFromDelivery(req.tenantId, deliveryId);
  }
}

