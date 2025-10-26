"use client";
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { showToast } from '../../../../toast';

type Line = { desc: string; qty: number; unit: number };
type Invoice = { id: string; customer: string; amount: number; status: string; items?: Line[]; date?: string; notes?: string };

export default function InvoiceAdminEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [inv, setInv] = useState<Invoice | null>(null);
  const [vatPct, setVatPct] = useState(17);
  const [discountPct, setDiscountPct] = useState(0);
  const [terms, setTerms] = useState('');

  useEffect(()=> {
    const stored = localStorage.getItem('demo-invoices');
    const arr: any[] = stored ? JSON.parse(stored) : [];
    const found = arr.find(x => x.id === id);
    setInv(found || { id: String(id), customer: '', amount: 0, status: 'created-demo', items: [{ desc:'', qty:1, unit:0 }], date: new Date().toISOString().slice(0,10) });
  }, [id]);

  const total = useMemo(()=> (inv?.items || []).reduce((s, it)=> s + (Number(it.qty)||0)*(Number(it.unit)||0), 0), [inv]);
  const discountAmount = useMemo(()=> Math.round(total * (discountPct/100)), [total, discountPct]);
  const taxable = useMemo(()=> Math.max(total - discountAmount, 0), [total, discountAmount]);
  const vatAmount = useMemo(()=> Math.round(taxable * (vatPct/100)), [taxable, vatPct]);
  const grand = useMemo(()=> taxable + vatAmount, [taxable, vatAmount]);

  if (typeof window !== 'undefined' && localStorage.getItem('admin-mode') !== 'true') {
    return <section className="card">אין הרשאה. הפעל מצב אדמין ב־Super Admin.</section>;
  }
  if (!inv) return <section className="card">טוען...</section>;

  const save = () => {
    try {
      const stored = localStorage.getItem('demo-invoices');
      const arr: any[] = stored ? JSON.parse(stored) : [];
      const idx = arr.findIndex(x => x.id === inv.id);
      const next = { ...inv, amount: grand, vatPct, discountPct, terms };
      if (idx >= 0) arr[idx] = next; else arr.unshift(next);
      localStorage.setItem('demo-invoices', JSON.stringify(arr));
      showToast('חשבונית נשמרה');
      router.push(`/invoices/${inv.id}`);
    } catch { showToast('שגיאה בשמירה'); }
  };

  return (
    <section className="card" style={{ display:'grid', gap: 12 }}>
      <h1 className="text-3xl" style={{ marginTop:0 }}>עריכת חשבונית {String(id)}</h1>
      <label style={{ display:'grid', gap: 6 }}>
        לקוח
        <input value={inv.customer} onChange={(e)=> setInv({ ...inv, customer: e.target.value })} />
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        תאריך
        <input type="date" value={inv.date || ''} onChange={(e)=> setInv({ ...inv, date: e.target.value })} />
      </label>
      <div style={{ color:'var(--color-muted)' }}>שורות פריט</div>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>תיאור</th>
            <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>כמות</th>
            <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>מחיר יח׳</th>
            <th style={{ textAlign:'right', padding:8, borderBottom:'1px solid #e5e7eb' }}>סה"כ</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(inv.items || []).map((it, idx) => (
            <tr key={idx}>
              <td style={{ padding:8 }}><input value={it.desc} onChange={e=> {
                const items = [...(inv.items||[])]; items[idx].desc = e.target.value; setInv({ ...inv, items });
              }} /></td>
              <td style={{ padding:8 }}><input type="number" value={it.qty} onChange={e=> {
                const items = [...(inv.items||[])]; items[idx].qty = Number(e.target.value)||0; setInv({ ...inv, items });
              }} /></td>
              <td style={{ padding:8 }}><input type="number" value={it.unit} onChange={e=> {
                const items = [...(inv.items||[])]; items[idx].unit = Number(e.target.value)||0; setInv({ ...inv, items });
              }} /></td>
              <td style={{ padding:8 }}>₪{(((Number(it.qty)||0)*(Number(it.unit)||0))).toLocaleString('he-IL')}</td>
              <td style={{ padding:8 }}><button className="btn" onClick={()=> {
                const items = (inv.items||[]).filter((_,i)=> i!==idx); setInv({ ...inv, items });
              }}>מחק</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button className="btn" onClick={()=> setInv({ ...inv, items: [ ...(inv.items||[]), { desc:'', qty:1, unit:0 } ] })}>+ הוסף שורה</button>
      </div>
      <div style={{ display:'grid', gap: 8 }}>
        <label style={{ display:'grid', gap: 6 }}>
          מע"מ (%)
          <input type="number" value={vatPct} onChange={(e)=> setVatPct(Number(e.target.value)||0)} />
        </label>
        <label style={{ display:'grid', gap: 6 }}>
          הנחה (%)
          <input type="number" value={discountPct} onChange={(e)=> setDiscountPct(Number(e.target.value)||0)} />
        </label>
        <div>סכום ביניים: ₪{total.toLocaleString('he-IL')}</div>
        <div>הנחה: ₪{discountAmount.toLocaleString('he-IL')}</div>
        <div>חייב במע"מ: ₪{taxable.toLocaleString('he-IL')}</div>
        <div>מע"מ: ₪{vatAmount.toLocaleString('he-IL')}</div>
        <div><strong>סה"כ לתשלום: ₪{grand.toLocaleString('he-IL')}</strong></div>
      </div>
      <label style={{ display:'grid', gap: 6 }}>
        סטטוס
        <select value={inv.status} onChange={(e)=> setInv({ ...inv, status: e.target.value })}>
          <option value="created-demo">נוצר (דמו)</option>
          <option value="pending">ממתין</option>
          <option value="paid">שולם</option>
          <option value="cancelled">בוטל</option>
        </select>
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        הערות
        <textarea value={inv.notes || ''} onChange={(e)=> setInv({ ...inv, notes: e.target.value })} />
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        תנאי תשלום
        <input value={terms} onChange={(e)=> setTerms(e.target.value)} placeholder="שוטף + 30 / מזומן / ..." />
      </label>
      <div style={{ display:'flex', gap: 8, justifyContent:'flex-end' }}>
        <button className="btn" onClick={()=> router.push(`/invoices/${id}`)}>בטל</button>
        <button className="btn" onClick={save}>שמור</button>
      </div>
    </section>
  );
}


