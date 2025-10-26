"use client";

import { DemoBanner } from './dashboard-banner';
import { useState } from 'react';
import { QuickCreateInvoice, QuickCreateOrder } from './QuickCreate';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [openInv, setOpenInv] = useState(false);
  const [openOrd, setOpenOrd] = useState(false);
  const reset = async () => {
    try {
      localStorage.removeItem('cart');
      await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4010/api') + '/superadmin/resetDemo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': (process.env.NEXT_PUBLIC_TENANT_ID || 'furniture-demo') },
      });
      location.reload();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="dashboard-grid">
      {/* Left rail cards */}
      <div className="dashboard-card-grid">
        <section className="card">
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <h1 className="text-3xl" style={{margin:0}}>מרכז הניהול המקצועי</h1>
            <span style={{color:'var(--color-muted)'}}>(היום)</span>
          </div>
          <p style={{margin:0, color:'var(--color-muted)'}}>אין ביקורים מתוכננים להיום.</p>
        </section>

        <section className="card">
          <h2 style={{marginTop:0, marginBottom:12}}>פעולות מהירות</h2>
          <div className="quick-actions">
            <button className="btn" onClick={()=> setOpenInv(true)}>🧾 יצירת חשבונית</button>
            <a className="btn" href="/deliveries">🚚 משלוח מיידי</a>
            <a className="btn" href="/products">🛒 ניהול מוצרים</a>
            <button className="btn" onClick={()=> setOpenOrd(true)}>📦 הזמנת עבודה</button>
            <a className="btn" href="/settings/branding">🎨 מיתוג</a>
            <a className="btn" href="/superadmin">🔧 Super Admin</a>
            <button className="btn" onClick={reset}>♻️ Reset Demo</button>
          </div>
        </section>

        <section className="card">
          <h2 style={{marginTop:0, marginBottom:12}}>מקרא צבעים</h2>
          <ul style={{margin:0, padding:0, listStyle:'none', display:'grid', gap:8}}>
            <li><span className="status-dot" style={{background:'#fde68a', display:'inline-block', width:10, height:10, borderRadius:9999}}/> ממתין לאישור</li>
            <li><span className="status-dot" style={{background:'#93c5fd', display:'inline-block', width:10, height:10, borderRadius:9999}}/> אישור</li>
            <li><span className="status-dot" style={{background:'#fca5a5', display:'inline-block', width:10, height:10, borderRadius:9999}}/> ביטול</li>
            <li><span className="status-dot" style={{background:'#86efac', display:'inline-block', width:10, height:10, borderRadius:9999}}/> תשלום</li>
          </ul>
        </section>
      </div>

      {/* Right main calendar mock */}
      <section className="card" style={{ display:'grid', gap: 12 }}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <h2 style={{marginTop:0}}>אוקטובר 2025</h2>
          <div style={{display:'flex', gap:8}}>
            <button className="btn" aria-label="prev">‹</button>
            <button className="btn" aria-label="next">›</button>
          </div>
        </div>
        {/* גרף קטן – דמו */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, alignItems:'end', height:120 }}>
          {[40, 65, 30, 80, 50, 90].map((h,i)=> (
            <div key={i} style={{ background:'rgba(14,165,233,0.35)', height:h, borderRadius:6 }} />
          ))}
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:8}}>
          {Array.from({length:35}).map((_,i)=> (
            <div key={i} style={{border:'1px solid #e5e7eb', borderRadius:8, minHeight:90, padding:8, background:'#fff'}}>
              <div style={{textAlign:'left', color:'var(--color-muted)'}}>{i+1 <= 31 ? (i+1) : ''}</div>
            </div>
          ))}
        </div>
      </section>
      <QuickCreateInvoice open={openInv} onClose={()=> setOpenInv(false)} />
      <QuickCreateOrder open={openOrd} onClose={()=> setOpenOrd(false)} />
    </div>
  );
}


