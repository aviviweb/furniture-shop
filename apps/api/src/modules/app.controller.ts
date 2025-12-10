import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { isDemoMode } from './shared/demo-mode';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth() {
    const isDemo = isDemoMode();
    const health: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      demoMode: isDemo,
      services: {
        api: 'ok',
        database: 'unknown',
      },
    };

    if (!isDemo) {
      try {
        // Try a simple database query
        await this.prisma.$queryRaw`SELECT 1`;
        health.services.database = 'ok';
      } catch (error: any) {
        health.services.database = 'error';
        health.databaseError = error?.message || 'Connection failed';
        health.status = 'degraded';
      }
    } else {
      health.services.database = 'demo';
    }

    return health;
  }
}


