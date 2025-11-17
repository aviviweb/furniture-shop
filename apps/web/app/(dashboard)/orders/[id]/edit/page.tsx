"use client";
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { showToast } from '../../../../toast';

type Line = { sku: string; desc: string; qty: number };
type Order = { id: string; customer: string; product: string; qty: number; status: string; date?: string; notes?: string; items?: Line[] };

export default function OrderAdminEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [ord, setOrd] = useState<Order | null>(null);

  useEffect(()=> {
    const stored = localStorage.getItem('demo-orders');
    const arr: any[] = stored ? JSON.parse(stored) : [];
    const found = arr.find(x => x.id === id);
    setOrd(found || { id: String(id), customer: '', product: 'PRD-001', qty: 1, status: 'processing', items: [{ sku:'', desc:'', qty:1 }], date: new Date().toISOString().slice(0,10) });
  }, [id]);

  const totalQty = useMemo(()=> (ord?.items || []).reduce((s, it)=> s + (Number(it.qty)||0), 0), [ord]);
  const [vatPct, setVatPct] = useState(0);
  const [discountPct, setDiscountPct] = useState(0);
  const subtotal = useMemo(()=> (ord?.items || []).reduce((s, it)=> s + (Number(it.qty)||0)*1, 0), [ord]);
  const discountAmount = useMemo(()=> Math.round(subtotal*(discountPct/100)), [subtotal, discountPct]);
  const taxable = useMemo(()=> Math.max(subtotal-discountAmount, 0), [subtotal, discountAmount]);
  const vatAmount = useMemo(()=> Math.round(taxable*(vatPct/100)), [taxable, vatPct]);
  const grand = useMemo(()=> taxable + vatAmount, [taxable, vatAmount]);

  if (typeof window !== 'undefined' && localStorage.getItem('admin-mode') !== 'true') {
    return <section className="card">אין הרשאה. הפעל מצב אדמין במנהל מערכת.</section>;
  }
  if (!ord) return <section className="card">טוען...</section>;

  const save = () => {
    try {
      const stored = localStorage.getItem('demo-orders');
      const arr: any[] = stored ? JSON.parse(stored) : [];
      const idx = arr.findIndex(x => x.id === ord.id);
      const next = { ...ord, vatPct, discountPct, totals: { subtotal, discountAmount, taxable, vatAmount, grand } };
      if (idx >= 0) arr[idx] = next; else arr.unshift(next);
      localStorage.setItem('demo-orders', JSON.stringify(arr));
      showToast('הזמנה נשמרה');
      router.push(`/orders/${ord.id}`);
    } catch { showToast('שגיאה בשמירה'); }
  };

  return (
    <section className="card" style={{ display:'grid', gap: 12 }}>
      <h1 className="text-3xl" style={{ marginTop:0 }}>עריכת הזמנה {String(id)}</h1>
      <label style={{ display:'grid', gap: 6 }}>
        לקוח
        <input value={ord.customer} onChange={(e)=> setOrd({ ...ord, customer: e.target.value })} />
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        תאריך
        <input type="date" value={ord.date || ''} onChange={(e)=> setOrd({ ...ord, date: e.target.value })} />
      </label>
      <div style={{ color:'var(--color-muted)' }}>שורות פריט</div>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>מק"ט</th>
            <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>תיאור</th>
            <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>כמות</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(ord.items || []).map((it, idx) => (
            <tr key={idx}>
              <td style={{ padding:8 }}><input value={it.sku} onChange={e=> {
                const items = [...(ord.items||[])]; items[idx].sku = e.target.value; setOrd({ ...ord, items });
              }} /></td>
              <td style={{ padding:8 }}><input value={it.desc} onChange={e=> {
                const items = [...(ord.items||[])]; items[idx].desc = e.target.value; setOrd({ ...ord, items });
              }} /></td>
              <td style={{ padding:8 }}><input type="number" value={it.qty} onChange={e=> {
                const items = [...(ord.items||[])]; items[idx].qty = Number(e.target.value)||0; setOrd({ ...ord, items });
              }} /></td>
              <td style={{ padding:8 }}><button className="btn" onClick={()=> {
                const items = (ord.items||[]).filter((_,i)=> i!==idx); setOrd({ ...ord, items });
              }}>מחק</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button className="btn" onClick={()=> setOrd({ ...ord, items: [ ...(ord.items||[]), { sku:'', desc:'', qty:1 } ] })}>+ הוסף שורה</button>
      </div>
      <div>סה"כ כמות: <strong>{totalQty}</strong></div>
      <div style={{ display:'grid', gap: 8 }}>
        <label style={{ display:'grid', gap: 6 }}>
          מע"מ (%)
          <input type="number" value={vatPct} onChange={(e)=> setVatPct(Number(e.target.value)||0)} />
        </label>
        <label style={{ display:'grid', gap: 6 }}>
          הנחה (%)
          <input type="number" value={discountPct} onChange={(e)=> setDiscountPct(Number(e.target.value)||0)} />
        </label>
        <div>סכום ביניים: {subtotal}</div>
        <div>הנחה: {discountAmount}</div>
        <div>חייב במע"מ: {taxable}</div>
        <div>מע"מ: {vatAmount}</div>
        <div><strong>סה"כ: {grand}</strong></div>
      </div>
      <label style={{ display:'grid', gap: 6 }}>
        סטטוס
        <select value={ord.status} onChange={(e)=> setOrd({ ...ord, status: e.target.value })}>
          <option value="processing">בעיבוד</option>
          <option value="shipped">נשלח</option>
          <option value="cancelled">בוטל</option>
        </select>
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        הערות
        <textarea value={ord.notes || ''} onChange={(e)=> setOrd({ ...ord, notes: e.target.value })} />
      </label>
      <div style={{ display:'flex', gap: 8, justifyContent:'flex-end' }}>
        <button className="btn" onClick={()=> router.push(`/orders/${id}`)}>בטל</button>
        <button className="btn" onClick={save}>שמור</button>
      </div>
    </section>
  );
}


