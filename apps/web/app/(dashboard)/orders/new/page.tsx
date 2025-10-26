"use client";
import { useMemo, useState } from 'react';
import { apiPost } from '../../../../lib/api';
import { showToast } from '../../../toast';
import { useRouter } from 'next/navigation';

export default function NewOrderPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState('לקוח דמו');
  const [product, setProduct] = useState('PRD-001');
  const [qty, setQty] = useState(1);
  const [result, setResult] = useState('');
  const [items, setItems] = useState<Array<{ sku: string; desc: string; qty: number }>>([
    { sku: 'PRD-001', desc: 'מוצר דמו', qty: 1 },
  ]);
  const totalQty = useMemo(()=> items.reduce((s, it)=> s + (Number(it.qty)||0), 0), [items]);

  async function submit() {
      const payload: any = { customer, product, qty, items };
    try {
      let res: any;
      try {
        res = await apiPost('/orders', payload);
      } catch {
        const seq = Number(localStorage.getItem('seq-orders') || '5000') + 1;
        localStorage.setItem('seq-orders', String(seq));
        res = { id: `ORD-${seq}`, ...payload, status: 'created-demo' };
      }
      setResult(JSON.stringify(res));
      showToast('הזמנה נוצרה (דמו)');

      try {
        const stored = localStorage.getItem('demo-orders');
        const arr = stored ? JSON.parse(stored) : [];
        arr.unshift(res);
        localStorage.setItem('demo-orders', JSON.stringify(arr));
      } catch {}

      setTimeout(()=> router.push('/orders'), 300);
    } catch (e: any) {
      setResult(e?.message || 'error');
    }
  }

  return (
    <section className="card" style={{ display:'grid', gap: 12, maxWidth: 520 }}>
      <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>יצירת הזמנה</h1>
      <label style={{ display:'grid', gap: 6 }}>
        לקוח
        <input value={customer} onChange={(e)=> setCustomer(e.target.value)} />
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        מוצר (מק"ט)
        <input value={product} onChange={(e)=> setProduct(e.target.value)} />
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        כמות
        <input type="number" value={qty} onChange={(e)=> setQty(Number(e.target.value)||1)} />
      </label>
      <div style={{ display:'grid', gap: 8 }}>
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
            {items.map((it, idx) => (
              <tr key={idx}>
                <td style={{ padding:8 }}><input value={it.sku} onChange={e=> {
                  const copy = [...items]; copy[idx].sku = e.target.value; setItems(copy);
                }} /></td>
                <td style={{ padding:8 }}><input value={it.desc} onChange={e=> {
                  const copy = [...items]; copy[idx].desc = e.target.value; setItems(copy);
                }} /></td>
                <td style={{ padding:8 }}><input type="number" value={it.qty} onChange={e=> {
                  const copy = [...items]; copy[idx].qty = Number(e.target.value)||0; setItems(copy);
                }} /></td>
                <td style={{ padding:8 }}>
                  <button className="btn" onClick={()=> setItems(items.filter((_,i)=> i!==idx))}>מחק</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button className="btn" onClick={()=> setItems([...items, { sku:'', desc:'', qty:1 }])}>+ הוסף שורה</button>
        </div>
      </div>
      <div style={{ textAlign:'left' }}>סה"כ כמות בשורות: <strong>{totalQty}</strong></div>
      <button className="btn" onClick={submit}>צור הזמנה (דמו)</button>
      <pre style={{ margin: 0 }}>{result}</pre>
    </section>
  );
}


