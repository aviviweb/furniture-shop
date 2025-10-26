import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SuperAdminController } from './superadmin.controller';

@Module({ imports: [PrismaModule], controllers: [SuperAdminController] })
export class SuperAdminModule {}


