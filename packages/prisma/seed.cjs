/* eslint-disable */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // platform company for SUPER_ADMIN
  const platform = await prisma.company.upsert({
    where: { tenantId: 'platform' },
    create: { tenantId: 'platform', name: 'Platform', currency: 'ILS' },
    update: {},
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: 'super@platform.local' },
    create: { email: 'super@platform.local', password: 'changeme', role: 'SUPER_ADMIN', companyId: platform.id },
    update: {},
  });

  const company = await prisma.company.upsert({
    where: { tenantId: 'furniture-demo' },
    create: { tenantId: 'furniture-demo', name: 'Furniture Demo Ltd', currency: 'ILS' },
    update: {},
  });

  await prisma.brandSettings.upsert({
    where: { companyId: company.id },
    create: { companyId: company.id, primaryColor: '#0ea5e9', secondaryColor: '#10b981' },
    update: {},
  });

  const owners = await Promise.all([
    prisma.user.upsert({
      where: { email: 'owner1@demo.local' },
      create: { email: 'owner1@demo.local', password: 'changeme', role: 'OWNER', companyId: company.id },
      update: {},
    }),
    prisma.user.upsert({
      where: { email: 'owner2@demo.local' },
      create: { email: 'owner2@demo.local', password: 'changeme', role: 'OWNER', companyId: company.id },
      update: {},
    }),
  ]);

  const customer = await prisma.customer.create({
    data: { companyId: company.id, name: 'ישראל ישראלי', phone: '050-0000000' },
  });

  const product = await prisma.product.create({
    data: { companyId: company.id, name: 'ספת בד מודולרית', description: 'ספה נוחה ואיכותית' },
  });
  const variant = await prisma.productVariant.create({
    data: { productId: product.id, sku: 'SOFA-001-GR', price: 2990.00, stock: 10 },
  });

  await prisma.inventory.upsert({
    where: { variantId: variant.id },
    create: { companyId: company.id, variantId: variant.id, quantity: 10, minThreshold: 2, location: 'מרלו"ג מרכז' },
    update: { quantity: 10 },
  });

  const order = await prisma.order.create({
    data: { companyId: company.id, customerId: customer.id, status: 'pending', total: 2990.00 },
  });
  await prisma.orderItem.create({
    data: { orderId: order.id, variantId: variant.id, qty: 1, price: 2990.00 },
  });

  await prisma.invoiceSequence.upsert({
    where: { companyId_type: { companyId: company.id, type: 'TAX' } },
    create: { companyId: company.id, type: 'TAX', current: 0 },
    update: {},
  });

  const nextNumber = (await prisma.invoiceSequence.update({
    where: { companyId_type: { companyId: company.id, type: 'TAX' } },
    data: { current: { increment: 1 } },
  })).current;

  const beforeVat = 2990.00;
  const vat = 0.17 * beforeVat;
  const afterVat = beforeVat + vat;

  const invoice = await prisma.invoice.create({
    data: {
      companyId: company.id,
      orderId: order.id,
      type: 'TAX',
      invoiceNumber: nextNumber,
      vatRate: 0.17,
      currency: 'ILS',
      totalBeforeVat: beforeVat,
      totalVat: vat,
      totalAfterVat: afterVat,
      createdBy: owners[0].id,
    },
  });

  await prisma.expense.create({
    data: {
      companyId: company.id,
      fileUrl: 'https://example.com/receipt.jpg',
      category: 'ציוד משרדי',
      amount: 125.50,
      vatAmount: 18.43,
    },
  });

  await prisma.auditLog.create({
    data: {
      companyId: company.id,
      actorId: owners[0].id,
      action: 'SEED_INIT',
      entity: 'Company',
      entityId: company.id,
    },
  });

  console.log('Seed completed for platform + tenant furniture-demo');
}

main().finally(() => prisma.$disconnect());


