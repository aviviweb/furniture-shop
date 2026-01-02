import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { isDemoMode } from './modules/shared/demo-mode';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

function runMigrations() {
  // Only run migrations in production and if not in demo mode
  if (process.env.NODE_ENV === 'production' && !isDemoMode() && process.env.DATABASE_URL) {
    try {
      console.log('🔄 Running database migrations...');
      // Find prisma schema path
      const prismaSchemaPath = join(__dirname, '../../../packages/prisma/schema.prisma');
      if (existsSync(prismaSchemaPath)) {
        // Run migrations using prisma CLI
        execSync('pnpm --filter @furniture/prisma migrate deploy', {
          stdio: 'inherit',
          cwd: join(__dirname, '../../..'),
          env: process.env,
        });
        console.log('✅ Database migrations completed successfully');
      } else {
        console.warn('⚠️ Prisma schema not found, skipping migrations');
      }
    } catch (error: any) {
      console.error('❌ Migration failed:', error?.message || error);
      // Don't exit - let the app start anyway (migrations might already be applied)
      console.warn('⚠️ Continuing startup despite migration error');
    }
  } else {
    console.log('⏭️ Skipping migrations (development mode or demo mode)');
  }
}

async function bootstrap() {
  // Run migrations before starting the app
  runMigrations();
  
  const app = await NestFactory.create(AppModule);
  
  // CORS configuration - support both production and development
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3010',
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
  ].filter(Boolean) as string[];
  
  app.enableCors({ 
    origin: allowedOrigins.length > 0 ? allowedOrigins : (process.env.NODE_ENV === 'production' ? false : true),
    // In production, require explicit CORS origins. In development, allow all for easier testing.
    // Note: Direct browser access (not CORS) should still work
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
  });
  
  app.setGlobalPrefix('api');
  const isDemo = isDemoMode();
  // Render sets PORT dynamically - must use it
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  
  // Listen on all interfaces (0.0.0.0) for Render compatibility
  await app.listen(port, '0.0.0.0');
  console.log(`✅ API running on port ${port}, Demo Mode: ${isDemo}`);
  console.log(`✅ CORS enabled for origins: ${allowedOrigins.join(', ')}`);
  console.log(`✅ Listening on 0.0.0.0:${port} (Render compatible)`);
}

bootstrap();


