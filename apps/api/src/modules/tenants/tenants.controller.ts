import { Controller, Get, Req } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('companies')
export class TenantsController {
  constructor(private tenants: TenantsService) {}

  @Get('me')
  async me(@Req() req: any) {
    const company = await this.tenants.getCompanyByTenant(req.tenantId);
    return company;
  }
}


