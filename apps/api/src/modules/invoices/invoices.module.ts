import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';

@Module({
  imports: [PrismaModule],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}


