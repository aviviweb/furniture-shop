import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isDemoMode } from '../shared/demo-mode';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async list(companyId: string, options?: { onlyAvailable?: boolean }) {
    const isDemo = isDemoMode();
    
    // תמיד להשתמש ב-prisma - ב-demo mode זה יחזיר את ה-mock data
    const where: any = { companyId };
    
    if (options?.onlyAvailable) {
      where.variants = {
        some: {
          stock: {
            gt: 0,
          },
        },
      };
    }

    return this.prisma.product.findMany({
      where,
      include: {
        variants: {
          include: {
            attributes: {
              include: {
                Attribute: true,
                AttributeValue: true,
              },
            },
          },
        },
      },
    });
  }

  async create(companyId: string, data: {
    name: string;
    description?: string;
    imageUrl?: string;
    variants?: {
      sku: string;
      price: number;
      stock?: number;
      imageUrl?: string;
      vatRate?: number;
    }[];
  }) {
    return this.prisma.product.create({
      data: {
        companyId,
        name: data.name,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        variants: {
          create: (data.variants || []).map(v => ({
            sku: v.sku,
            price: v.price,
            stock: v.stock ?? 0,
            imageUrl: v.imageUrl || null,
            vatRate: v.vatRate || null,
          })),
        },
      },
      include: {
        variants: {
          include: {
            attributes: {
              include: {
                Attribute: true,
                AttributeValue: true,
              },
            },
          },
        },
      },
    });
  }

  async update(companyId: string, id: string, data: {
    name?: string;
    description?: string;
    imageUrl?: string;
  }) {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
      },
      include: {
        variants: {
          include: {
            attributes: {
              include: {
                Attribute: true,
                AttributeValue: true,
              },
            },
          },
        },
      },
    });
  }

  async updateVariant(companyId: string, productId: string, variantId: string, data: {
    sku?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
    vatRate?: number;
  }) {
    // Verify product belongs to company
    const product = await this.prisma.product.findFirst({
      where: { id: productId, companyId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: {
        sku: data.sku,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl,
        vatRate: data.vatRate,
      },
      include: {
        attributes: {
          include: {
            Attribute: true,
            AttributeValue: true,
          },
        },
      },
    });
  }
}


