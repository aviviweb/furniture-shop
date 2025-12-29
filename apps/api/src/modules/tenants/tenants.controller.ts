import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('companies')
export class TenantsController {
  constructor(private tenants: TenantsService) {}

  @Get('me')
  async me(@Req() req: any) {
    const company = await this.tenants.getCompanyByTenant(req.tenantId);
    return company;
  }

  @Patch('branding')
  async updateBranding(@Req() req: any, @Body() body: any) {
    return await this.tenants.updateBranding(req.tenantId, body);
  }

  @Get('settings')
  async getSettings(@Req() req: any) {
    return await this.tenants.getSettings(req.tenantId);
  }

  @Patch('settings')
  async updateSettings(
    @Req() req: any,
    @Body() body: {
      defaultVatRate?: number;
      baseShippingCost?: number;
      shippingCostPerKm?: number;
      shippingCostPerFloor?: number;
      baseAssemblyCost?: number;
    },
  ) {
    return await this.tenants.updateSettings(req.tenantId, body);
  }
}


