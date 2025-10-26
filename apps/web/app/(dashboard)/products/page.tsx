"use client";
import { downloadCSV, uploadCSV } from '../../csv';
import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '../../../lib/api';

export const dynamic = 'force-dynamic';

type Product = { id: string; name: string; price: number; stock?: number };

const demo: Product[] = [
  { id: 'PRD-001', name: 'ספה 3 מושבים', price: 2490, stock: 5 },
  { id: 'PRD-002', name: 'כורסה', price: 990, stock: 12 },
  { id: 'PRD-003', name: 'שולחן סלון', price: 790, stock: 7 },
];

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>(()=> {
    const stored = typeof window !== 'undefined' && localStorage.getItem('demo-products');
    return stored ? JSON.parse(stored) : demo;
  });
  const [q, setQ] = useState(()=> (typeof window !== 'undefined' && localStorage.getItem('q-products')) || '');

  useEffect(()=> {
    (async ()=> {
      try {
        const r = await apiGet<Product[]>('/products');
        if (Array.isArray(r)) setData(r);
      } catch {}
    })();
  }, []);

  const [priceMax, setPriceMax] = useState('');
  const [arch, setArch] = useState('');
  const filtered = useMemo(()=> data.filter(p => {
    const text = p.name.includes(q) || p.id.includes(q);
    const pm = Number(priceMax);
    const priceOk = !priceMax || p.price <= pm;
    const a = (p as any).archived === true;
    const archOk = arch === '' || (arch === 'archived' ? a : !a);
    return text && priceOk && archOk;
  }), [data, q, priceMax, arch]);

  if (typeof window !== 'undefined') {
    localStorage.setItem('demo-products', JSON.stringify(data));
    localStorage.setItem('q-products', q);
  }

  return (
    <section className="card" style={{ display:'grid', gap: 12 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>מוצרים</h1>
        <button className="btn" onClick={()=> downloadCSV('products.csv', filtered)}>ייצוא CSV</button>
        <button className="btn" onClick={()=> uploadCSV((rows)=> { try { const s=localStorage.getItem('demo-products'); const arr=s?JSON.parse(s):[]; rows.forEach(r=> arr.unshift({ id:r.id||`PRD-${Date.now()}`, name:r.name||'', price:Number(r.price||0), stock:Number((r as any).stock||0) })); localStorage.setItem('demo-products', JSON.stringify(arr)); location.reload(); } catch {} })}>ייבוא CSV</button>
      </div>
      <input placeholder="חיפוש לפי שם/מק״ט" value={q} onChange={(e)=> setQ(e.target.value)} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 180px 160px', gap:8 }}>
        <input placeholder="סינון לפי מחיר עד..." value={priceMax} onChange={(e)=> setPriceMax(e.target.value)} />
        <select value={arch} onChange={(e)=> setArch(e.target.value)}>
          <option value="">פעילים + ארכיון</option>
          <option value="active">רק פעילים</option>
          <option value="archived">רק ארכיון</option>
        </select>
      </div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>מק"ט</th>
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>שם</th>
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>מחיר</th>
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>מלאי</th>
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding:16, color:'var(--color-muted)' }}>אין תוצאות תואמות לחיפוש.</td>
              </tr>
            )}
            {filtered.map(row => (
              <tr key={row.id}>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{row.id}</td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{row.name}</td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>₪{row.price.toLocaleString('he-IL')}</td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{row.stock ?? '-'}</td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>
                  <button className="btn" onClick={()=> { try { const s=localStorage.getItem('demo-products'); const arr=s?JSON.parse(s):[]; const idx=arr.findIndex((x:any)=> x.id===row.id); if(idx>=0){ arr[idx].archived=!arr[idx].archived; localStorage.setItem('demo-products', JSON.stringify(arr)); } } catch {} }}> {(row as any).archived ? 'שחזר' : 'ארכב'} </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


