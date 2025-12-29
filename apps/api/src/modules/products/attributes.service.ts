import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Injectable()
export class AttributesService {
  constructor(private prisma: PrismaService) {}

  async list(companyId: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return [
        {
          id: 'attr-demo-1',
          name: 'צבע',
          type: 'PREDEFINED',
          isRequired: false,
          displayOrder: 0,
          values: [
            { id: 'val-demo-1', value: 'אדום', displayOrder: 0 },
            { id: 'val-demo-2', value: 'כחול', displayOrder: 1 },
          ],
        },
        {
          id: 'attr-demo-2',
          name: 'גודל',
          type: 'PREDEFINED',
          isRequired: false,
          displayOrder: 1,
          values: [
            { id: 'val-demo-3', value: '160x200', displayOrder: 0 },
            { id: 'val-demo-4', value: '180x200', displayOrder: 1 },
          ],
        },
      ];
    }

    return this.prisma.productAttribute.findMany({
      where: { companyId },
      include: {
        values: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async create(companyId: string, data: {
    name: string;
    type?: 'PREDEFINED' | 'DYNAMIC';
    isRequired?: boolean;
    displayOrder?: number;
  }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: `attr-demo-${Date.now()}`,
        companyId,
        ...data,
        type: data.type || 'PREDEFINED',
        isRequired: data.isRequired || false,
        displayOrder: data.displayOrder || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return this.prisma.productAttribute.create({
      data: {
        companyId,
        name: data.name,
        type: data.type || 'PREDEFINED',
        isRequired: data.isRequired || false,
        displayOrder: data.displayOrder || 0,
      },
      include: {
        values: true,
      },
    });
  }

  async update(companyId: string, id: string, data: {
    name?: string;
    type?: 'PREDEFINED' | 'DYNAMIC';
    isRequired?: boolean;
    displayOrder?: number;
  }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id,
        companyId,
        ...data,
        updatedAt: new Date(),
      };
    }

    const attribute = await this.prisma.productAttribute.findFirst({
      where: { id, companyId },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    return this.prisma.productAttribute.update({
      where: { id },
      data,
      include: {
        values: true,
      },
    });
  }

  async delete(companyId: string, id: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return { id, deleted: true };
    }

    const attribute = await this.prisma.productAttribute.findFirst({
      where: { id, companyId },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    // Check if attribute is used in any variants
    const variantAttributes = await this.prisma.productVariantAttribute.findMany({
      where: { attributeId: id },
      take: 1,
    });

    if (variantAttributes.length > 0) {
      throw new BadRequestException('Cannot delete attribute that is used in product variants');
    }

    return this.prisma.productAttribute.delete({
      where: { id },
    });
  }

  async listValues(companyId: string, attributeId: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return [
        { id: 'val-demo-1', attributeId, value: 'אדום', displayOrder: 0 },
        { id: 'val-demo-2', attributeId, value: 'כחול', displayOrder: 1 },
      ];
    }

    const attribute = await this.prisma.productAttribute.findFirst({
      where: { id: attributeId, companyId },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    return this.prisma.productAttributeValue.findMany({
      where: { attributeId },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async createValue(companyId: string, attributeId: string, data: {
    value: string;
    displayOrder?: number;
  }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: `val-demo-${Date.now()}`,
        attributeId,
        ...data,
        displayOrder: data.displayOrder || 0,
        createdAt: new Date(),
      };
    }

    const attribute = await this.prisma.productAttribute.findFirst({
      where: { id: attributeId, companyId },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    if (attribute.type === 'DYNAMIC') {
      throw new BadRequestException('Cannot add predefined values to dynamic attribute');
    }

    return this.prisma.productAttributeValue.create({
      data: {
        attributeId,
        value: data.value,
        displayOrder: data.displayOrder || 0,
      },
    });
  }

  async updateValue(companyId: string, attributeId: string, valueId: string, data: {
    value?: string;
    displayOrder?: number;
  }) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return {
        id: valueId,
        attributeId,
        ...data,
      };
    }

    const attribute = await this.prisma.productAttribute.findFirst({
      where: { id: attributeId, companyId },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    const value = await this.prisma.productAttributeValue.findFirst({
      where: { id: valueId, attributeId },
    });

    if (!value) {
      throw new NotFoundException('Attribute value not found');
    }

    return this.prisma.productAttributeValue.update({
      where: { id: valueId },
      data,
    });
  }

  async deleteValue(companyId: string, attributeId: string, valueId: string) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return { id: valueId, deleted: true };
    }

    const attribute = await this.prisma.productAttribute.findFirst({
      where: { id: attributeId, companyId },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    const value = await this.prisma.productAttributeValue.findFirst({
      where: { id: valueId, attributeId },
    });

    if (!value) {
      throw new NotFoundException('Attribute value not found');
    }

    // Check if value is used in any variants
    const variantAttributes = await this.prisma.productVariantAttribute.findMany({
      where: { attributeValueId: valueId },
      take: 1,
    });

    if (variantAttributes.length > 0) {
      throw new BadRequestException('Cannot delete value that is used in product variants');
    }

    return this.prisma.productAttributeValue.delete({
      where: { id: valueId },
    });
  }

  async setVariantAttributes(companyId: string, variantId: string, attributes: {
    attributeId: string;
    value?: string;
    attributeValueId?: string;
  }[]) {
    const isDemo = isDemoMode();
    
    if (isDemo) {
      return attributes.map(attr => ({
        id: `pva-demo-${Date.now()}`,
        variantId,
        ...attr,
      }));
    }

    // Verify variant belongs to company
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId },
      include: { Product: true },
    });

    if (!variant || variant.Product.companyId !== companyId) {
      throw new NotFoundException('Product variant not found');
    }

    // Delete existing attributes
    await this.prisma.productVariantAttribute.deleteMany({
      where: { variantId },
    });

    // Create new attributes
    if (attributes.length > 0) {
      await this.prisma.productVariantAttribute.createMany({
        data: attributes.map(attr => ({
          variantId,
          attributeId: attr.attributeId,
          value: attr.value || null,
          attributeValueId: attr.attributeValueId || null,
        })),
      });
    }

    return this.prisma.productVariantAttribute.findMany({
      where: { variantId },
      include: {
        Attribute: true,
        AttributeValue: true,
      },
    });
  }
}

