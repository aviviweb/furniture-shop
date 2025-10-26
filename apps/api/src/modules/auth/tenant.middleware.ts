import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const headerTenant = req.header('x-tenant-id');
    // allow subdomain parsing in future; for now prefer header
    (req as any).tenantId = headerTenant || 'furniture-demo';
    next();
  }
}


