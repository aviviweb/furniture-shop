"use client";
import { useState } from 'react';
import { apiPost } from '../../lib/api';
import { showToast } from '../toast';
import { useRouter } from 'next/navigation';

export function QuickCreateInvoice({ open, onClose }: { open: boolean; onClose: ()=>void }) {
  const router = useRouter();
  const [customer, setCustomer] = useState('לקוח דמו');
  const [amount, setAmount] = useState(200);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=> e.stopPropagation()}>
        <h2 style={{ marginTop:0 }}>חשבונית מהירה</h2>
        <div style={{ display:'grid', gap: 8 }}>
          <input value={customer} onChange={(e)=> setCustomer(e.target.value)} placeholder="לקוח" />
          <input type="number" value={amount} onChange={(e)=> setAmount(Number(e.target.value)||0)} placeholder="סכום" />
          <div style={{ display:'flex', gap: 8, justifyContent:'flex-end' }}>
            <button className="btn" onClick={onClose}>ביטול</button>
            <button className="btn" onClick={async ()=>{
              const payload = { customer, amount };
              try {
                let res: any;
                try { res = await apiPost('/invoices', payload); } 
                catch { res = { id: `INV-${Date.now()}`, customer, amount, status: 'created-demo' }; }
                const stored = localStorage.getItem('demo-invoices');
                const arr = stored ? JSON.parse(stored) : [];
                arr.unshift(res);
                localStorage.setItem('demo-invoices', JSON.stringify(arr));
                showToast('חשבונית נוצרה');
                onClose();
                router.push('/invoices');
              } catch { showToast('שגיאה'); }
            }}>צור</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuickCreateOrder({ open, onClose }: { open: boolean; onClose: ()=>void }) {
  const router = useRouter();
  const [customer, setCustomer] = useState('לקוח דמו');
  const [product, setProduct] = useState('PRD-001');
  const [qty, setQty] = useState(1);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=> e.stopPropagation()}>
        <h2 style={{ marginTop:0 }}>הזמנה מהירה</h2>
        <div style={{ display:'grid', gap: 8 }}>
          <input value={customer} onChange={(e)=> setCustomer(e.target.value)} placeholder="לקוח" />
          <input value={product} onChange={(e)=> setProduct(e.target.value)} placeholder='מק"ט' />
          <input type="number" value={qty} onChange={(e)=> setQty(Number(e.target.value)||1)} placeholder="כמות" />
          <div style={{ display:'flex', gap: 8, justifyContent:'flex-end' }}>
            <button className="btn" onClick={onClose}>ביטול</button>
            <button className="btn" onClick={async ()=>{
              const payload = { customer, product, qty };
              try {
                let res: any;
                try { res = await apiPost('/orders', payload); }
                catch { res = { id: `ORD-${Date.now()}`, ...payload, status: 'created-demo' }; }
                const stored = localStorage.getItem('demo-orders');
                const arr = stored ? JSON.parse(stored) : [];
                arr.unshift(res);
                localStorage.setItem('demo-orders', JSON.stringify(arr));
                showToast('הזמנה נוצרה');
                onClose();
                router.push('/orders');
              } catch { showToast('שגיאה'); }
            }}>צור</button>
          </div>
        </div>
      </div>
    </div>
  );
}


