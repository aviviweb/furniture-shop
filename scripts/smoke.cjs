/* Basic smoke tests for local/dev */
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function main() {
  const base = process.env.API || 'http://localhost:4000/api';
  const ok = [];
  const res1 = await fetch(`${base}/companies/me`);
  ok.push(['GET /companies/me', res1.status]);
  const res2 = await fetch(`${base}/invoices`, { method: 'POST', headers: {'Content-Type':'application/json','x-tenant-id':'furniture-demo'}, body: JSON.stringify({ type: 'TAX', items: [{ description: 'בדיקה', qty: 1, unitPrice: 100 }] })});
  ok.push(['POST /invoices', res2.status]);
  const res3 = await fetch(`${base}/expenses/scan`, { method: 'POST', headers: {'Content-Type':'application/json','x-tenant-id':'furniture-demo'}, body: JSON.stringify({ fileUrl: 'https://example.com/receipt.jpg' })});
  ok.push(['POST /expenses/scan', res3.status]);
  const res4 = await fetch(`${base}/orders`, { method: 'POST', headers: {'Content-Type':'application/json','x-tenant-id':'furniture-demo'}, body: JSON.stringify({ items: [{ variantId: 'var-demo', qty: 1, price: 2990 }] })});
  ok.push(['POST /orders', res4.status]);
  const res5 = await fetch(`${base}/deliveries/optimize`, { method: 'POST', headers: {'Content-Type':'application/json','x-tenant-id':'furniture-demo'}, body: JSON.stringify({ stops: [{ id:'A', lat:32.1, lng:34.8 }, { id:'B', lat:32.2, lng:34.7 }] })});
  ok.push(['POST /deliveries/optimize', res5.status]);
  const res6 = await fetch(`${base}/reports/generate`, { method: 'POST', headers: {'Content-Type':'application/json','x-tenant-id':'furniture-demo'}, body: JSON.stringify({ type: 'sales' })});
  ok.push(['POST /reports/generate', res6.status]);
  console.table(ok);
}

main();



