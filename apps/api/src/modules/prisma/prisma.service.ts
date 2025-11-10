import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

type PrismaClientLike = any;

function createDemoPrismaMock(): PrismaClientLike {
  const now = new Date();
  const demoCompany = {
    id: 'demo-company',
    tenantId: 'furniture-demo',
    name: 'Furniture Demo Ltd',
    currency: 'ILS',
    demoMode: true,
    createdAt: now,
    updatedAt: now,
    brand: {
      id: 'demo-brand',
      companyId: 'demo-company',
      primaryColor: '#0ea5e9',
      secondaryColor: '#10b981',
      logoUrl: null,
      domain: null,
      website: null,
      facebook: null,
      instagram: null,
      whatsapp: null,
      linkedin: null,
    },
  };

  const users = [
    { id: 'demo-owner-1', email: 'owner1@demo.local', password: 'changeme', role: 'OWNER', companyId: demoCompany.id },
    { id: 'demo-owner-2', email: 'owner2@demo.local', password: 'changeme', role: 'OWNER', companyId: demoCompany.id },
  ];

  // simple in-memory DB for demo
  const db = {
    products: [] as any[],
    variants: [] as any[],
    orders: [] as any[],
    orderItems: [] as any[],
    invoiceSequences: [] as any[],
    invoices: [] as any[],
    auditLogs: [] as any[],
  };

  const newId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
  const resolveCompanyId = (companyId?: string) => {
    if (!companyId) return demoCompany.id;
    return companyId === demoCompany.tenantId ? demoCompany.id : companyId;
  };
  // seed multiple demo products + variants on first access
  const ensureSeed = () => {
    if (db.products.length === 0) {
      const demoProducts = [
        { name: 'ספת בד מודולרית', description: 'ספה נוחה ואיכותית', price: 2990, sku: 'PRD-001', stock: 10, category: 'ספות', imageUrl: 'https://images.unsplash.com/photo-1612637968894-6601d6c35c97?q=80&w=1200&auto=format&fit=crop' },
        { name: 'פינת ישיבה עץ מלא', description: 'סט איכותי לסלון', price: 4590, sku: 'PRD-002', stock: 7, category: 'סלון', imageUrl: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?q=80&w=1200&auto=format&fit=crop' },
        { name: 'שולחן קפה עגול', description: 'שולחן במראה מודרני', price: 690, sku: 'PRD-003', stock: 25, category: 'שולחנות', imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop' },
        { name: 'כיסא בר מרופד', description: 'נוח ויציב למטבח', price: 380, sku: 'PRD-004', stock: 30, category: 'כיסאות', imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop' },
        { name: 'ארון הזזה 3 דלתות', description: 'אחסון רחב לחדר שינה', price: 3290, sku: 'PRD-005', stock: 5, category: 'ארונות', imageUrl: 'https://images.unsplash.com/photo-1604937455095-ef2fe3d34e05?q=80&w=1200&auto=format&fit=crop' },
        { name: 'כורסה צבעונית', description: 'כורסה מעוצבת ונוחה', price: 1290, sku: 'PRD-006', stock: 15, category: 'כיסאות', imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200&auto=format&fit=crop' },
        { name: 'שולחן עגול אוכל', description: 'שולחן מתאים ל-6 אנשים', price: 1890, sku: 'PRD-007', stock: 8, category: 'שולחנות', imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop' },
        { name: 'ספה בשורה 3 מושבים', description: 'ספה פינתית מרווחת', price: 5490, sku: 'PRD-008', stock: 6, category: 'ספות', imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop' },
        { name: 'מיטה זוגית מעוצבת', description: 'שינה נוחה ואיכותית', price: 3990, sku: 'PRD-009', stock: 12, category: 'חדר שינה', imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop' },
        { name: 'קונסולה לקירות', description: 'קונסולה אלגנטית לסלון', price: 890, sku: 'PRD-010', stock: 20, category: 'ארונות', imageUrl: 'https://images.unsplash.com/photo-1576502200272-341a4b11d717?q=80&w=1200&auto=format&fit=crop' },
        { name: 'שולחן עבודה עץ מלא', description: 'שולחן עבודה מרווח', price: 2490, sku: 'PRD-011', stock: 10, category: 'שולחנות', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop' },
        { name: 'כורסת טלוויזיה נוחה', description: 'כורסה מפוארת לפינה', price: 1790, sku: 'PRD-012', stock: 14, category: 'כיסאות', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop' },
        { name: 'ספה בצורת L', description: 'ספה מרווחת לעיצוב מודרני', price: 5990, sku: 'PRD-013', stock: 4, category: 'ספות', imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop' },
        { name: 'ארון שידות זוגי', description: 'סט זוגי לארונות שידות', price: 2190, sku: 'PRD-014', stock: 9, category: 'חדר שינה', imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1200&auto=format&fit=crop' },
        { name: 'שולחן סלון עגול', description: 'שולחן עיצוב לסלון', price: 1490, sku: 'PRD-015', stock: 11, category: 'שולחנות', imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1200&auto=format&fit=crop' },
        { name: 'כיסא מנהלים עץ', description: 'כיסא משרדי איכותי', price: 890, sku: 'PRD-016', stock: 18, category: 'כיסאות', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=1200&auto=format&fit=crop' },
        { name: 'סלון נפתח מלא', description: 'סלון מתאים לפינה גדולה', price: 6990, sku: 'PRD-017', stock: 3, category: 'סלון', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop' },
        { name: 'שולחן עבודה מתכוונן', description: 'שולחן גובה משתנה', price: 3490, sku: 'PRD-018', stock: 7, category: 'שולחנות', imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop' },
        { name: 'מיטה מעוצבת משפחתית', description: 'שינה מרווחת לזוג', price: 4990, sku: 'PRD-019', stock: 9, category: 'חדר שינה', imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop' },
        { name: 'ארון קיר רחב 4 דלתות', description: 'אחסון מרבי', price: 4290, sku: 'PRD-020', stock: 5, category: 'ארונות', imageUrl: 'https://images.unsplash.com/photo-1604937455095-ef2fe3d34e05?q=80&w=1200&auto=format&fit=crop' },
        { name: 'ספה זוויתית מודרנית', description: 'פינה מעוצבת לסלון', price: 6490, sku: 'PRD-021', stock: 4, category: 'ספות', imageUrl: 'https://images.unsplash.com/photo-1612637968894-6601d6c35c97?q=80&w=1200&auto=format&fit=crop' },
        { name: 'כורסת נוחה מעוצבת', description: 'כורסה לעבודה ונוחות', price: 2190, sku: 'PRD-022', stock: 12, category: 'כיסאות', imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200&auto=format&fit=crop' },
      ];
      for (const p of demoProducts) {
        const pid = newId('prd');
        db.products.push({
          id: pid,
          companyId: demoCompany.id,
          name: p.name,
          description: p.description,
          category: p.category,
          imageUrl: p.imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        // create two variants per product (e.g., different SKU/price)
        const base = Math.max(1, Number(p.price));
        const variants = [
          { sku: p.sku, price: base, stock: p.stock },
          { sku: p.sku + '-B', price: Math.round(base * 1.15), stock: Math.max(0, Math.floor((p.stock || 0) / 2)) },
        ];
        for (const v of variants) {
          db.variants.push({ id: newId('var'), productId: pid, sku: v.sku, price: v.price, stock: v.stock });
        }
      }
    }
  };

  return {
    $connect: undefined,
    $disconnect: undefined,
    // Demo helpers (non-Prisma API)
    resetDemo: async () => {
      db.products = [];
      db.variants = [];
      db.orders = [];
      db.orderItems = [];
      db.invoiceSequences = [];
      db.invoices = [];
      db.auditLogs = [];
      ensureSeed();
      return { ok: true };
    },
    company: {
      findUnique: async ({ where }: any) => {
        if (where?.tenantId && where.tenantId !== demoCompany.tenantId) return null;
        if (where?.id && where.id !== demoCompany.id) return null;
        return demoCompany;
      },
      findFirst: async ({ where }: any) => {
        if (where?.id && where.id !== demoCompany.id) return null;
        return demoCompany;
      },
      update: async ({ where, data }: any) => {
        if (where?.tenantId && where.tenantId !== demoCompany.tenantId) throw new Error('Not found');
        demoCompany.demoMode = !!data?.demoMode;
        return { tenantId: demoCompany.tenantId, demoMode: demoCompany.demoMode };
      },
    },
    user: {
      findUnique: async ({ where }: any) => users.find(u => u.email === where?.email) || null,
    },
    expense: {
      create: async ({ data }: any) => ({ id: 'demo-expense', ...data }),
    },

    // Products
    product: {
      findMany: async ({ where, include }: any) => {
        ensureSeed();
        const cid = resolveCompanyId(where?.companyId);
        const items = db.products.filter(p => !cid || p.companyId === cid);
        if (include?.variants) {
          return items.map(p => ({
            ...p,
            variants: db.variants.filter(v => v.productId === p.id),
          }));
        }
        return items;
      },
      create: async ({ data, include }: any) => {
        ensureSeed();
        const id = newId('prd');
        const product = {
          id,
          companyId: resolveCompanyId(data.companyId),
          name: data.name,
          description: data.description ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        db.products.unshift(product);
        const createdVariants: any[] = [];
        const toCreate = (data?.variants?.create || []) as any[];
        toCreate.forEach(v => {
          const vid = newId('var');
          const variant = {
            id: vid,
            productId: id,
            sku: v.sku,
            price: Number(v.price) || 0,
            stock: Number(v.stock ?? 0),
          };
          db.variants.unshift(variant);
          createdVariants.push(variant);
        });
        return include?.variants ? { ...product, variants: createdVariants } : product;
      },
    },
    productVariant: {
      update: async ({ where, data }: any) => {
        const item = db.variants.find(v => v.id === where?.id);
        if (!item) throw new Error('Variant not found');
        if (typeof data?.stock?.decrement === 'number') {
          item.stock = Math.max(0, Number(item.stock || 0) - Number(data.stock.decrement));
        }
        return item;
      },
    },

    // Orders
    order: {
      create: async ({ data }: any) => {
        const order = { id: newId('ord'), companyId: resolveCompanyId(data.companyId), total: Number(data.total || 0), createdAt: new Date() };
        db.orders.unshift(order);
        return order;
      },
    },
    orderItem: {
      create: async ({ data }: any) => {
        const item = { id: newId('oi'), ...data };
        db.orderItems.unshift(item);
        return item;
      },
    },

    // Invoices
    invoiceSequence: {
      upsert: async ({ where, create, update }: any) => {
        const key = where?.companyId_type;
        const cid = resolveCompanyId(key?.companyId || create?.companyId);
        const type = key?.type || create?.type;
        let row = db.invoiceSequences.find(s => s.companyId === cid && s.type === type);
        if (!row) {
          row = { id: newId('seq'), companyId: cid, type, current: create?.current ?? 0 };
          db.invoiceSequences.push(row);
        } else if (update?.current?.increment) {
          row.current += Number(update.current.increment);
        }
        return row;
      },
    },
    invoice: {
      create: async ({ data }: any) => {
        const inv = { id: newId('inv'), ...data };
        db.invoices.unshift(inv);
        return inv;
      },
    },
    auditLog: {
      create: async ({ data }: any) => {
        const row = { id: newId('log'), createdAt: new Date(), ...data };
        db.auditLogs.unshift(row);
        return row;
      },
    },

    // transaction shim - מספק את כל ה-operations ב-transaction context
    $transaction: async (fn: (tx: any) => Promise<any>) => {
      const tx = {
        order: {
          create: (this as any).order.create,
        },
        orderItem: {
          create: (this as any).orderItem.create,
        },
        productVariant: {
          update: (this as any).productVariant.update,
        },
        invoice: {
          create: (this as any).invoice.create,
        },
        auditLog: {
          create: (this as any).auditLog.create,
        },
        invoiceSequence: {
          upsert: (this as any).invoiceSequence.upsert,
        },
      } as any;
      return await fn(tx);
    },
  };
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: PrismaClientLike;
  [key: string]: any;

  constructor() {
    const isDemo = (process.env.DEMO_MODE ?? 'true') !== 'false';
    if (isDemo) {
      this.client = createDemoPrismaMock();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PrismaClient } = require('@prisma/client');
      this.client = new PrismaClient();
    }

    // Proxy: expose Prisma client API directly on service instance
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target) return Reflect.get(target, prop, receiver);
        // Delegate unknown props to the underlying client (e.g., company, user)
        return (target.client as any)[prop as any];
      },
    }) as any;
  }

  async onModuleInit() {
    if (this.client && typeof this.client.$connect === 'function') {
      await this.client.$connect();
    }
  }

  async onModuleDestroy() {
    if (this.client && typeof this.client.$disconnect === 'function') {
      await this.client.$disconnect();
    }
  }
}


