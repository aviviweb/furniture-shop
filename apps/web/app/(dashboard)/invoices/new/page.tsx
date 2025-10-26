"use client";
import { useMemo, useState } from 'react';
import { apiPost } from '../../../../lib/api';
import { showToast } from '../../../toast';
import { useRouter } from 'next/navigation';

export default function NewInvoicePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState('לקוח דמו');
  const [amount, setAmount] = useState(250); // backward compat
  const [items, setItems] = useState<Array<{ desc: string; qty: number; unit: number }>>([
    { desc: 'שירות/מוצר דמו', qty: 1, unit: 250 },
  ]);
  const total = useMemo(()=> items.reduce((s, it) => s + (Number(it.qty)||0) * (Number(it.unit)||0), 0), [items]);
  const [result, setResult] = useState('');
  const [err, setErr] = useState('');

  async function submit() {
    setErr('');
    try {
      // נסה API, ואם נכשל נייצר תוצאה לוקלית
      const payload: any = { customer, amount: total || amount, items };
      let res: any;
      try {
        res = await apiPost('/invoices', payload);
      } catch {
        // demo running number
        const seq = Number(localStorage.getItem('seq-invoices') || '1000') + 1;
        localStorage.setItem('seq-invoices', String(seq));
        res = { id: `INV-${seq}`, customer, amount: total || amount, items, status: 'created-demo' };
      }
      setResult(JSON.stringify(res));
      showToast('חשבונית נוצרה (דמו)');

      // persist locally for listings
      try {
        const stored = localStorage.getItem('demo-invoices');
        const arr = stored ? JSON.parse(stored) : [];
        arr.unshift(res);
        localStorage.setItem('demo-invoices', JSON.stringify(arr));
      } catch {}

      // redirect to list
      setTimeout(()=> router.push('/invoices'), 300);
    } catch (e: any) {
      setErr(e?.message || 'error');
    }
  }

  return (
    <section className="card" style={{ display:'grid', gap: 12, maxWidth: 520 }}>
      <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>יצירת חשבונית</h1>
      <label style={{ display:'grid', gap: 6 }}>
        לקוח
        <input value={customer} onChange={(e)=> setCustomer(e.target.value)} />
      </label>
      <div style={{ display:'grid', gap: 8 }}>
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
            {items.map((it, idx) => (
              <tr key={idx}>
                <td style={{ padding:8 }}><input value={it.desc} onChange={e=> {
                  const copy = [...items]; copy[idx].desc = e.target.value; setItems(copy);
                }} /></td>
                <td style={{ padding:8 }}><input type="number" value={it.qty} onChange={e=> {
                  const copy = [...items]; copy[idx].qty = Number(e.target.value)||0; setItems(copy);
                }} /></td>
                <td style={{ padding:8 }}><input type="number" value={it.unit} onChange={e=> {
                  const copy = [...items]; copy[idx].unit = Number(e.target.value)||0; setItems(copy);
                }} /></td>
                <td style={{ padding:8 }}>₪{((Number(it.qty)||0)*(Number(it.unit)||0)).toLocaleString('he-IL')}</td>
                <td style={{ padding:8 }}>
                  <button className="btn" onClick={()=> setItems(items.filter((_,i)=> i!==idx))}>מחק</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button className="btn" onClick={()=> setItems([...items, { desc: '', qty: 1, unit: 0 }])}>+ הוסף שורה</button>
        </div>
      </div>
      <div style={{ textAlign:'left' }}>
        <strong>סה"כ: ₪{(total || amount).toLocaleString('he-IL')}</strong>
      </div>
      <button className="btn" onClick={submit}>צור (דמו)</button>
      {err && <span style={{ color:'#ef4444' }}>{err}</span>}
      <pre style={{ margin: 0 }}>{result}</pre>
    </section>
  );
}


