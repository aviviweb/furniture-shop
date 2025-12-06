import { Body, Controller, Patch, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Controller('superadmin')
export class SuperAdminController {
  constructor(private prisma: PrismaService) {}

  @Patch('toggleDemoMode')
  async toggle(@Body() body: { tenantId: string; demo: boolean }) {
    const isDemo = isDemoMode();
    if (isDemo) {
      return { tenantId: body.tenantId, demoMode: body.demo };
    }
    const company = await this.prisma.company.update({ where: { tenantId: body.tenantId }, data: { demoMode: body.demo } });
    return { tenantId: company.tenantId, demoMode: company.demoMode };
  }

  @Post('resetDemo')
  async resetDemo() {
    const isDemo = isDemoMode();
    if (!isDemo) return { ok: false };
    const anyClient = this.prisma as any;
    if (typeof anyClient.resetDemo === 'function') {
      return await anyClient.resetDemo();
    }
    return { ok: false };
  }
}


