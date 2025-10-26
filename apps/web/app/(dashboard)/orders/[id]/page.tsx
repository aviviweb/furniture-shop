"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Order = { id: string; customer: string; product: string; qty: number; status: string };

export default function OrderDetailPage() {
  const params = useParams();
  const id = String(params?.id || '');
  const [item, setItem] = useState<Order | null>(null);

  useEffect(()=> {
    const stored = typeof window !== 'undefined' && localStorage.getItem('demo-orders');
    const arr: any[] = stored ? JSON.parse(stored) : [];
    const found = arr.find(x => x.id === id);
    setItem(found || null);
  }, [id]);

  return (
    <section className="card" style={{ display:'grid', gap: 12 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>הזמנה {id}</h1>
        <div style={{ display:'flex', gap: 8 }}>
          {typeof window !== 'undefined' && localStorage.getItem('admin-mode') === 'true' && (
            <>
              <a className="btn" href={`/orders/${id}/edit`}>עריכה</a>
              <button className="btn" onClick={()=> { try { const s=localStorage.getItem('demo-orders'); const arr=s?JSON.parse(s):[]; const found=arr.find((x:any)=> x.id===id); if(found) { const blob=new Blob([JSON.stringify(found,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${id}.json`; a.click(); URL.revokeObjectURL(url);} } catch {} }}>ייצוא JSON</button>
              <button className="btn" onClick={()=> { const input=document.createElement('input'); input.type='file'; input.accept='application/json'; input.onchange=()=>{ const f=input.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const obj=JSON.parse(String(r.result||'')); const s=localStorage.getItem('demo-orders'); const arr=s?JSON.parse(s):[]; const idx=arr.findIndex((x:any)=> x.id===id); const next={...obj, id}; if(idx>=0) arr[idx]=next; else arr.unshift(next); localStorage.setItem('demo-orders', JSON.stringify(arr)); location.reload(); }catch{}}; r.readAsText(f); }; input.click(); }}>ייבוא JSON</button>
              <button className="btn" onClick={()=> { try { const s=localStorage.getItem('demo-orders'); const arr=s?JSON.parse(s):[]; const found=arr.find((x:any)=> x.id===id); if(!found) return; const seq = Number(localStorage.getItem('seq-orders') || '5000') + 1; localStorage.setItem('seq-orders', String(seq)); const clone={...found, id:`ORD-${seq}`}; arr.unshift(clone); localStorage.setItem('demo-orders', JSON.stringify(arr)); location.assign(`/orders/${clone.id}`);} catch {} }}>שכפל</button>
            </>
          )}
          <button className="btn" onClick={()=> window.print()}>הדפסה / PDF</button>
        </div>
      </div>
      {!item && <p style={{ margin:0, color:'var(--color-muted)' }}>לא נמצאו נתונים להזמנה זו (דמו).</p>}
      {item && (
        <div style={{ display:'grid', gap: 8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {typeof window !== 'undefined' && (()=>{ try { const s=localStorage.getItem('demo-brand'); const l=s?JSON.parse(s).logo:''; return l? <img src={l} alt="logo" style={{ height:32 }} /> : null;} catch { return null; } })()}
            <div style={{ fontSize:18 }}><strong>ריהוט בע"מ</strong></div>
          </div>
          <div style={{ color:'var(--color-muted)' }}>
            הזמנת עבודה — {typeof window !== 'undefined' && (()=>{ try { const s=localStorage.getItem('demo-brand'); if(!s) return 'ח.פ. 123456789 | טל׳ 03-0000000'; const b=JSON.parse(s); return `${b.companyId || 'ח.פ. 123456789'} | ${b.phone || 'טל׳ 03-0000000'} | ${b.address || ''}`; } catch { return 'ח.פ. 123456789 | טל׳ 03-0000000'; } })()}
          </div>
          <hr />
          <div>לקוח: <strong>{item.customer}</strong></div>
          <div>מס׳ הזמנה: <strong>{id}</strong></div>
          <div>תאריך: <strong>{new Date().toLocaleDateString('he-IL')}</strong></div>
          <div>מק"ט: <strong>{item.product}</strong></div>
          <div>כמות: <strong>{item.qty}</strong></div>
          <div>סטטוס: <span className={`badge ${item.status==='processing'?'badge-processing':'badge-shipped'}`}>{item.status}</span></div>
          <hr />
          <table style={{ width:'100%', borderCollapse:'collapse', marginTop:8 }}>
            <thead>
              <tr>
                <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>מק"ט</th>
                <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>תיאור</th>
                <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>כמות</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray((item as any).items) ? (item as any).items.map((it: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{it.sku || item.product}</td>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{it.desc || '—'}</td>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{it.qty ?? item.qty}</td>
                </tr>
              )) : (
                <tr>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{item.product}</td>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>מוצר דמו</td>
                  <td style={{ padding:8, borderBottom:'1px solid #f1f5f9' }}>{item.qty}</td>
                </tr>
              )}
            </tbody>
          </table>
          {typeof window !== 'undefined' && (()=>{ try { const s=localStorage.getItem('demo-orders'); const arr = s? JSON.parse(s): []; const found = arr.find((x:any)=> x.id===id); if(!found || !found.totals) return null; const t = found.totals; return (
            <div style={{ marginTop:8 }}>
              <div>סכום ביניים: {t.subtotal}</div>
              <div>הנחה: {t.discountAmount}</div>
              <div>חייב במע"מ: {t.taxable}</div>
              <div>מע"מ: {t.vatAmount}</div>
              <div><strong>סה"כ: {t.grand}</strong></div>
            </div>
          ); } catch { return null; } })()}
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
          <div style={{ fontSize:12, color:'var(--color-muted)', marginTop:8 }}>מסמך דמו — לצורכי הדמיה בלבד.</div>
        </div>
      )}
    </section>
  );
}


