import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private customers: CustomersService) {}

  @Get()
  list(@Req() req: any, @Query() query: { search?: string }) {
    return this.customers.list(req.tenantId, {
      search: query.search,
    });
  }

  @Get(':id')
  getById(@Req() req: any, @Param('id') id: string) {
    return this.customers.getById(req.tenantId, id);
  }

  @Get(':id/stats')
  getStats(@Req() req: any, @Param('id') id: string) {
    return this.customers.getStats(req.tenantId, id);
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: {
      name: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      zipCode?: string;
      vatNumber?: string;
      notes?: string;
    },
  ) {
    return this.customers.create(req.tenantId, body);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      zipCode?: string;
      vatNumber?: string;
      notes?: string;
    },
  ) {
    return this.customers.update(req.tenantId, id, body);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.customers.delete(req.tenantId, id);
  }
}

