import { Body, Controller, Patch, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Controller('superadmin')
export class SuperAdminController {
  constructor(private prisma: PrismaService) {}

  @Patch('toggleDemoMode')
  async toggle(@Body() body: { tenantId: string; demo: boolean }) {
    const isDemo = isDemoMode();
    
    // Always try to update in database, even if system is in demo mode
    // This allows users to toggle company-level demo mode independently
    try {
      const company = await this.prisma.company.update({ 
        where: { tenantId: body.tenantId }, 
        data: { demoMode: body.demo } 
      });
      return { 
        tenantId: company.tenantId, 
        demoMode: company.demoMode,
        systemDemoMode: isDemo,
        message: isDemo 
          ? 'Company demo mode updated, but system is in demo mode. Set DEMO_MODE=false to fully disable.' 
          : 'Company demo mode updated successfully'
      };
    } catch (error: any) {
      // If company doesn't exist or update fails, return the requested value
      // This allows the toggle to work even in full demo mode
      return { 
        tenantId: body.tenantId, 
        demoMode: body.demo,
        systemDemoMode: isDemo,
        warning: isDemo 
          ? 'System is in demo mode. Company not found in database. Set DEMO_MODE=false and ensure company exists in DB.' 
          : `Failed to update: ${error?.message || 'Unknown error'}`
      };
    }
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


