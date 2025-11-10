"use client";
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiGet } from '../../../../lib/api';
import { downloadJSON, uploadJSON } from '../../../json';

type Invoice = { id: string; customer: string; amount: number; status: string };

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = String(params?.id || '');
  const [item, setItem] = useState<Invoice | null>(null);

  useEffect(()=> {
    (async ()=> {
      try {
        const r = await apiGet<Invoice>(`/invoices/${id}`);
        if (r && r.id) { setItem(r); return; }
      } catch {}
      // fallback from local/demo
      const stored = typeof window !== 'undefined' && localStorage.getItem('demo-invoices');
      const arr: any[] = stored ? JSON.parse(stored) : [];
      const found = arr.find(x => x.id === id);
      setItem(found || null);
    })();
  }, [id]);

  const onPrint = () => {
    window.print();
  };

  if (!id) return <section className="card">לא נמצא מזהה.</section>;

  return (
    <section className="card" style={{ display:'grid', gap: 12 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>חשבונית {id}</h1>
        <div style={{ display:'flex', gap: 8 }}>
          {typeof window !== 'undefined' && localStorage.getItem('admin-mode') === 'true' && (
            <>
              <a className="btn" href={`/invoices/${id}/edit`}>עריכה</a>
              <button className="btn" onClick={()=> downloadJSON(`${id}.json`, item)}>ייצוא JSON</button>
              <button className="btn" onClick={()=> uploadJSON((obj)=> {
                try {
                  const stored = localStorage.getItem('demo-invoices');
                  const arr: any[] = stored ? JSON.parse(stored) : [];
                  const idx = arr.findIndex((x:any)=> x.id === id);
                  const next = { ...obj, id };
                  if (idx>=0) arr[idx]=next; else arr.unshift(next);
                  localStorage.setItem('demo-invoices', JSON.stringify(arr));
                  location.reload();
                } catch {}
              })}>ייבוא JSON</button>
              <button className="btn" onClick={()=> {
                try {
                  const stored = localStorage.getItem('demo-invoices');
                  const arr: any[] = stored ? JSON.parse(stored) : [];
                  const seq = Number(localStorage.getItem('seq-invoices') || '1000') + 1; localStorage.setItem('seq-invoices', String(seq));
                  const clone = { ...(item as any), id: `INV-${seq}` };
                  arr.unshift(clone); localStorage.setItem('demo-invoices', JSON.stringify(arr));
                  location.assign(`/invoices/${clone.id}`);
                } catch {}
              }}>שכפל</button>
            </>
          )}
          <button className="btn" onClick={onPrint}>הדפסה / PDF</button>
        </div>
      </div>
      {!item && <p style={{ margin:0, color:'var(--color-muted)' }}>טוען נתוני דמו...</p>}
      {item && (
        <div style={{ display:'grid', gap: 8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {typeof window !== 'undefined' && (()=>{ try { const s=localStorage.getItem('demo-brand'); const l=s?JSON.parse(s).logo:''; return l? <img src={l} alt="logo" style={{ height:32 }} /> : null;} catch { return null; } })()}
            <div style={{ fontSize:18 }}><strong>ריהוט בע"מ</strong></div>
          </div>
          <div style={{ color:'var(--color-muted)' }}>
            {typeof window !== 'undefined' && (()=>{ try { const s=localStorage.getItem('demo-brand'); if(!s) return 'ח.פ. 123456789 | טל׳ 03-0000000'; const b=JSON.parse(s); return `${b.companyId || 'ח.פ. 123456789'} | ${b.phone || 'טל׳ 03-0000000'} | ${b.address || ''}`; } catch { return 'ח.פ. 123456789 | טל׳ 03-0000000'; } })()}
          </div>
          <hr />
          <div>לקוח: <strong>{item.customer}</strong></div>
          <div>מס׳ חשבונית: <strong>{id}</strong></div>
          <div>תאריך: <strong>{new Date().toLocaleDateString('he-IL')}</strong></div>
          <div>סכום: <strong>₪{(item.amount || 0).toLocaleString('he-IL')}</strong></div>
          <div>סטטוס: <span className={`badge ${item.status==='paid'?'badge-paid':'badge-pending'}`}>{item.status}</span></div>
          <hr />
          <table style={{ width:'100%', borderCollapse:'collapse', marginTop:8 }}>
            <thead>
              <tr>
                <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>תיאור</th>
                <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>כמות</th>
                <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>מחיר יח׳</th>
                <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>סה"כ</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray((item as any).items) ? (item as any).items.map((it: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{it.desc || '—'}</td>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{it.qty ?? 0}</td>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>₪{(it.unit ?? 0).toLocaleString('he-IL')}</td>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>₪{(((Number(it.qty)||0)*(Number(it.unit)||0))).toLocaleString('he-IL')}</td>
                </tr>
              )) : (
                <tr>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>שירות/מוצר דמו</td>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>1</td>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>₪{(item.amount || 0).toLocaleString('he-IL')}</td>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>₪{(item.amount || 0).toLocaleString('he-IL')}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ textAlign:'left', marginTop:8 }}>
            <strong>סה"כ לתשלום: ₪{(item.amount || 0).toLocaleString('he-IL')}</strong>
            {typeof window !== 'undefined' && (()=>{ try { const stored = localStorage.getItem('demo-invoices'); const arr = stored? JSON.parse(stored): []; const found = arr.find((x:any)=> x.id===id); if(!found) return null; return found.terms ? <div style={{ marginTop:6, color:'var(--color-muted)' }}>תנאי תשלום: {found.terms}</div> : null; } catch { return null; } })()}
          </div>
          <div style={{ display:'flex', gap: 32, marginTop: 16 }}>
            <div style={{ flex:1 }}>
              <div style={{ color:'var(--color-muted)', marginBottom:24 }}>חתימת הלקוח:</div>
              <div style={{ borderTop:'1px solid #e5e7eb', height:0 }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:'var(--color-muted)', marginBottom:24 }}>חתימת החברה:</div>
              <div style={{ borderTop:'1px solid #e5e7eb', height:0 }} />
            </div>
          </div>
          <div style={{ fontSize:12, color:'var(--color-muted)', marginTop:8 }}>מסמך דמו — אינו מסמך חשבונאי.</div>
        </div>
      )}
    </section>
  );
}


