import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProductsService, AttributesService],
  controllers: [ProductsController, AttributesController],
})
export class ProductsModule {}


