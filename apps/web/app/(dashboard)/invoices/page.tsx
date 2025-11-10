"use client";
import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '../../../lib/api';
import { downloadCSV, uploadCSV } from '../../csv';

export const dynamic = 'force-dynamic';

type Invoice = { id: string; customer: string; amount: number; status: string };

const demo: Invoice[] = [
  { id: 'INV-001', customer: 'לקוח א', amount: 1200, status: 'paid' },
  { id: 'INV-002', customer: 'לקוח ב', amount: 450, status: 'pending' },
  { id: 'INV-003', customer: 'לקוח ג', amount: 890, status: 'paid' },
];

export default function InvoicesPage() {
  const [data, setData] = useState<Invoice[]>(()=> {
    const stored = typeof window !== 'undefined' && localStorage.getItem('demo-invoices');
    return stored ? JSON.parse(stored) : demo;
  });
  const [q, setQ] = useState(()=> (typeof window !== 'undefined' && localStorage.getItem('q-invoices')) || '');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [arch, setArch] = useState('');

  useEffect(()=> {
    (async ()=> {
      try {
        const r = await apiGet<Invoice[]>('/invoices');
        if (Array.isArray(r)) setData(r);
      } catch {}
    })();
  }, []);

  const filtered = useMemo(()=> data.filter(i => {
    const text = (i?.id || '').includes(q) || (((i as any)?.customer || '').includes(q));
    const st = !status || (i as any).status === status;
    const d = (i as any).date || '';
    const df = !dateFrom || d >= dateFrom;
    const dt = !dateTo || d <= dateTo;
    const a = (i as any).archived === true;
    const archOk = arch === '' || (arch === 'archived' ? a : !a);
    return text && st && df && dt && archOk;
  }), [data, q, status, dateFrom, dateTo]);

  // persist
  if (typeof window !== 'undefined') {
    localStorage.setItem('demo-invoices', JSON.stringify(data));
    localStorage.setItem('q-invoices', q);
    localStorage.setItem('flt-invoices', JSON.stringify({ status, dateFrom, dateTo }));
  }

  return (
    <section className="card" style={{ display:'grid', gap: 12 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>חשבוניות</h1>
        <div style={{ display:'flex', gap: 8 }}>
          <button className="btn" onClick={()=> downloadCSV('invoices.csv', filtered)}>ייצוא CSV</button>
          <button className="btn" onClick={()=> uploadCSV((rows)=> {
            try {
              const stored = localStorage.getItem('demo-invoices');
              const arr: any[] = stored ? JSON.parse(stored) : [];
              rows.forEach(r => arr.unshift({
                id: r.id || `INV-${Date.now()}`,
                customer: r.customer || '',
                amount: Number(r.amount||0),
                status: r.status || 'pending',
                date: r.date || ''
              }));
              localStorage.setItem('demo-invoices', JSON.stringify(arr));
              location.reload();
            } catch {}
          })}>ייבוא CSV</button>
          <a className="btn" href="/invoices/new">+ חשבונית חדשה</a>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 180px 160px 160px 160px', gap:8 }}>
        <input placeholder="חיפוש לפי מספר/לקוח" value={q} onChange={(e)=> setQ(e.target.value)} />
        <select value={status} onChange={(e)=> setStatus(e.target.value)}>
          <option value="">כל הסטטוסים</option>
          <option value="pending">ממתין</option>
          <option value="paid">שולם</option>
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
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>סכום</th>
              <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>סטטוס</th>
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
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>
                  <a href={`/invoices/${row.id}`} style={{ color:'var(--color-primary)', textDecoration:'none' }}>{row.id}</a>
                </td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{row.customer}</td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>₪{(row.amount || 0).toLocaleString('he-IL')}</td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>
                  <span className={`badge ${row.status==='paid'?'badge-paid':'badge-pending'}`}>{row.status}</span>
                </td>
                <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>
                  <button className="btn" onClick={()=> {
                    try {
                      const stored = localStorage.getItem('demo-invoices');
                      const arr: any[] = stored ? JSON.parse(stored) : [];
                      const idx = arr.findIndex((x:any)=> x.id === row.id);
                      if (idx>=0) { arr[idx].archived = !arr[idx].archived; localStorage.setItem('demo-invoices', JSON.stringify(arr)); }
                      setData(arr);
                    } catch {}
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


