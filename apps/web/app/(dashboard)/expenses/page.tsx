"use client";
import { useState } from 'react';
import { apiPost } from '../../../lib/api';
import { showToast } from '../../toast';

export const dynamic = 'force-dynamic';

export default function ExpensesPage() {
  const [fileUrl, setFileUrl] = useState('https://example.com/receipt.jpg');
  const [result, setResult] = useState('');
  return (
    <section className="card" style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>הוצאות</h1>
      <input value={fileUrl} onChange={(e)=> setFileUrl(e.target.value)} placeholder="קישור קבלה" />
      <button className="btn" onClick={async ()=> {
        try {
          const res = await apiPost('/expenses/scan', { fileUrl });
          setResult(JSON.stringify(res));
          showToast('קבלה נסרקה (דמו)');
        } catch (e: any) {
          setResult(e?.message || 'error');
          showToast('שגיאה בסריקה');
        }
      }}>סרוק קבלה (דמו)</button>
      <pre style={{ margin: 0 }}>{result}</pre>
    </section>
  );
}


