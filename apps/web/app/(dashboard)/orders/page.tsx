"use client";
import { downloadCSV, uploadCSV } from '../../csv';
import { useMemo, useState } from 'react';

export const dynamic = 'force-dynamic';

type Order = { id: string; customer: string; product: string; qty: number; status: string };

const demo: Order[] = [
  { id: 'ORD-1001', customer: 'לקוח א', product: 'PRD-001', qty: 1, status: 'processing' },
  { id: 'ORD-1002', customer: 'לקוח ב', product: 'PRD-002', qty: 2, status: 'shipped' },
];

export default function OrdersPage() {
  const [q, setQ] = useState(()=> (typeof window !== 'undefined' && localStorage.getItem('q-orders')) || '');
  const data = useMemo(()=> {
    if (typeof window === 'undefined') return demo;
    const stored = localStorage.getItem('demo-orders');
    const arr: Order[] = stored ? JSON.parse(stored) : [];
    return [...arr, ...demo];
  }, []);
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [arch, setArch] = useState('');
  const filtered = useMemo(()=> data.filter(o => {
    const text = (o?.id || '').includes(q) || (((o as any)?.customer || '').includes(q));
    const st = !status || o.status === status;
    const d = (o as any).date || '';
    const df = !dateFrom || d >= dateFrom;
    const dt = !dateTo || d <= dateTo;
    const a = (o as any).archived === true;
    const archOk = arch === '' || (arch === 'archived' ? a : !a);
    return text && st && df && dt && archOk;
  }), [data, q, status, dateFrom, dateTo, arch]);

  if (typeof window !== 'undefined') {
    localStorage.setItem('q-orders', q);
  }
  return (
    <section className="card" style={{ display:'grid', gap: 12 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>הזמנות</h1>
        <div style={{ display:'flex', gap: 8 }}>
          <button className="btn" onClick={()=> downloadCSV('orders.csv', filtered)}>ייצוא CSV</button>
          <button className="btn" onClick={()=> uploadCSV((rows)=> { try { const s=localStorage.getItem('demo-orders'); const arr=s?JSON.parse(s):[]; rows.forEach(r=> arr.unshift({ id:r.id||`ORD-${Date.now()}`, customer:r.customer||'', product:r.product||'', qty:Number(r.qty||1), status:r.status||'processing', date:r.date||'' })); localStorage.setItem('demo-orders', JSON.stringify(arr)); location.reload(); } catch {} })}>ייבוא CSV</button>
          <a className="btn" href="/orders/new">+ הזמנה חדשה</a>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 180px 160px 160px 160px', gap:8 }}>
        <input placeholder="חיפוש לפי מספר/לקוח" value={q} onChange={(e)=> setQ(e.target.value)} />
        <select value={status} onChange={(e)=> setStatus(e.target.value)}>
          <option value="">כל הסטטוסים</option>
          <option value="processing">בעיבוד</option>
          <option value="shipped">נשלח</option>
          <option value="cancelled">בוטל</option>
        </select>
        <input type="date" value={dateFrom} onChange={(e)=> setDateFrom(e.target.value)} />
        <input type="date" value={dateTo} onChange={(e)=> setDateTo(e.target.value)} />
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
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>מס'</th>
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>לקוח</th>
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>מק"ט</th>
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>כמות</th>
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>סטטוס</th>
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding:16, color:'var(--color-muted)' }}>אין תוצאות תואמות לחיפוש.</td>
              </tr>
            )}
            {filtered.map(row => (
              <tr key={row.id}>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>
                  <a href={`/orders/${row.id}`} style={{ color:'var(--color-primary)', textDecoration:'none' }}>{row.id}</a>
                </td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{row.customer}</td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{row.product}</td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{row.qty}</td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>
                  <span className={`badge ${row.status==='processing'?'badge-processing':'badge-shipped'}`}>{row.status}</span>
                </td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>
                  <button className="btn" onClick={()=> {
                    try { const s=localStorage.getItem('demo-orders'); const arr=s?JSON.parse(s):[]; const idx=arr.findIndex((x:any)=> x.id===row.id); if(idx>=0){ arr[idx].archived=!arr[idx].archived; localStorage.setItem('demo-orders', JSON.stringify(arr)); } setQ(q=> q); } catch {} 
                  }}>{(row as any).archived ? 'שחזר' : 'ארכב'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


