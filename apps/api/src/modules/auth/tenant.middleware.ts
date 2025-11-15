import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    // Priority 1: Header (from frontend)
    const headerTenant = req.header('x-tenant-id');
    
    // Priority 2: Subdomain from host (if API is called directly)
    let subdomainTenant: string | null = null;
    const host = req.get('host') || '';
    if (host) {
      const parts = host.split('.');
      // If we have more than 2 parts, there's a subdomain
      // Example: client1.yourdomain.com -> ['client1', 'yourdomain', 'com']
      if (parts.length > 2) {
        const firstPart = parts[0];
        // Skip known special subdomains
        if (firstPart !== 'www' && firstPart !== 'api' && firstPart !== 'admin') {
          subdomainTenant = firstPart;
        }
      }
    }
    
    // Use header first, then subdomain, then default
    (req as any).tenantId = headerTenant || subdomainTenant || 'furniture-demo';
    next();
  }
}


