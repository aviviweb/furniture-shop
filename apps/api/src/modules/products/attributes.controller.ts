import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { AttributesService } from './attributes.service';

@Controller('products/attributes')
export class AttributesController {
  constructor(private attributes: AttributesService) {}

  @Get()
  list(@Req() req: any) {
    return this.attributes.list(req.tenantId);
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: {
      name: string;
      type?: 'PREDEFINED' | 'DYNAMIC';
      isRequired?: boolean;
      displayOrder?: number;
    },
  ) {
    return this.attributes.create(req.tenantId, body);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      type?: 'PREDEFINED' | 'DYNAMIC';
      isRequired?: boolean;
      displayOrder?: number;
    },
  ) {
    return this.attributes.update(req.tenantId, id, body);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.attributes.delete(req.tenantId, id);
  }

  @Get(':id/values')
  listValues(@Req() req: any, @Param('id') attributeId: string) {
    return this.attributes.listValues(req.tenantId, attributeId);
  }

  @Post(':id/values')
  createValue(
    @Req() req: any,
    @Param('id') attributeId: string,
    @Body() body: { value: string; displayOrder?: number },
  ) {
    return this.attributes.createValue(req.tenantId, attributeId, body);
  }

  @Patch(':id/values/:valueId')
  updateValue(
    @Req() req: any,
    @Param('id') attributeId: string,
    @Param('valueId') valueId: string,
    @Body() body: { value?: string; displayOrder?: number },
  ) {
    return this.attributes.updateValue(req.tenantId, attributeId, valueId, body);
  }

  @Delete(':id/values/:valueId')
  deleteValue(
    @Req() req: any,
    @Param('id') attributeId: string,
    @Param('valueId') valueId: string,
  ) {
    return this.attributes.deleteValue(req.tenantId, attributeId, valueId);
  }

  @Post('variants/:variantId')
  setVariantAttributes(
    @Req() req: any,
    @Param('variantId') variantId: string,
    @Body() body: {
      attributes: {
        attributeId: string;
        value?: string;
        attributeValueId?: string;
      }[];
    },
  ) {
    return this.attributes.setVariantAttributes(req.tenantId, variantId, body.attributes);
  }
}

