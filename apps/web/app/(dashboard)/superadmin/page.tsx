"use client";
import { useState } from 'react';
import { apiPatch } from '../../../lib/api';

export default function SuperAdminPage() {
  const [tenantId, setTenantId] = useState('furniture-demo');
  const [demo, setDemo] = useState(false);
  const [result, setResult] = useState('');
  const [admin, setAdmin] = useState<boolean>(()=> (typeof window !== 'undefined' && localStorage.getItem('admin-mode') === 'true'));
  return (
    <section className="card" style={{ display:'grid', gap: 12, maxWidth: 520 }}>
      <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>מנהל מערכת</h1>
      <input value={tenantId} onChange={(e)=> setTenantId(e.target.value)} placeholder="tenantId" />
      <label><input type="checkbox" checked={demo} onChange={(e)=> setDemo(e.target.checked)} /> מצב דמו</label>
      <button className="btn" onClick={async ()=> {
        const res = await apiPatch('/superadmin/toggleDemoMode', { tenantId, demo });
        setResult(JSON.stringify(res));
      }}>שמור (דמו נתמך)</button>
      <pre style={{ margin: 0 }}>{result}</pre>

      <hr />
      <h2 style={{ margin:0 }}>מצב אדמין (לוקלי)</h2>
      <label>
        <input type="checkbox" checked={admin} onChange={(e)=> {
          const v = e.target.checked; setAdmin(v); localStorage.setItem('admin-mode', String(v));
        }} /> אפשר עריכת מסמכים
      </label>
    </section>
  );
}


