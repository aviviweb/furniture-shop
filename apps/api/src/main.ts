import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { isDemoMode } from './modules/shared/demo-mode';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS configuration - support both production and development
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3010',
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
  ].filter(Boolean) as string[];
  
  app.enableCors({ 
    origin: allowedOrigins.length > 0 ? allowedOrigins : true, // Allow all if no URLs specified
    credentials: true 
  });
  
  app.setGlobalPrefix('api');
  const isDemo = isDemoMode();
  // Allow overriding port even in demo mode to avoid conflicts
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port);
  console.log(`✅ API running on port ${port}, Demo Mode: ${isDemo}`);
  console.log(`✅ CORS enabled for origins: ${allowedOrigins.join(', ')}`);
}

bootstrap();


