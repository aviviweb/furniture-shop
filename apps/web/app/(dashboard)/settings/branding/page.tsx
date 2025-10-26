"use client";
import { useEffect, useState } from 'react';

function applyTheme(primary: string, accent: string) {
  const root = document.documentElement as HTMLElement;
  root.style.setProperty('--color-primary', primary);
  root.style.setProperty('--color-accent', accent);
}

export default function BrandingSettingsPage() {
  const [primary, setPrimary] = useState('#0ea5e9');
  const [accent, setAccent] = useState('#10b981');
  const [logoUrl, setLogoUrl] = useState('');
  const [saved, setSaved] = useState('');
  const [companyName, setCompanyName] = useState('ריהוט בע"מ');
  const [companyId, setCompanyId] = useState('123456789');
  const [phone, setPhone] = useState('03-0000000');
  const [address, setAddress] = useState('רח׳ הדוגמה 1, תל אביב');

  useEffect(() => {
    const stored = localStorage.getItem('demo-brand');
    if (stored) {
      const { primary: p, accent: a, logo, companyName: cn, companyId: cid, phone: ph, address: ad } = JSON.parse(stored);
      setPrimary(p); setAccent(a); setLogoUrl(logo || ''); applyTheme(p, a);
      if (cn) setCompanyName(cn); if (cid) setCompanyId(cid); if (ph) setPhone(ph); if (ad) setAddress(ad);
    }
  }, []);

  return (
    <section className="card" style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>מיתוג</h1>
      <label style={{ display:'grid', gap: 6 }}>
        צבע ראשי
        <input type="color" value={primary} onChange={(e)=> setPrimary(e.target.value)} />
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        צבע משני
        <input type="color" value={accent} onChange={(e)=> setAccent(e.target.value)} />
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        לוגו (URL)
        <input value={logoUrl} onChange={(e)=> setLogoUrl(e.target.value)} placeholder="https://.../logo.png" />
      </label>
      {logoUrl && (
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ color:'var(--color-muted)' }}>תצוגה מקדימה:</span>
          <img src={logoUrl} alt="logo" style={{ height:32 }} />
        </div>
      )}
      <label style={{ display:'grid', gap: 6 }}>
        שם חברה
        <input value={companyName} onChange={(e)=> setCompanyName(e.target.value)} />
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        ח.פ / עוסק
        <input value={companyId} onChange={(e)=> setCompanyId(e.target.value)} />
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        טלפון
        <input value={phone} onChange={(e)=> setPhone(e.target.value)} />
      </label>
      <label style={{ display:'grid', gap: 6 }}>
        כתובת
        <input value={address} onChange={(e)=> setAddress(e.target.value)} />
      </label>
      <div style={{ display:'flex', gap: 8 }}>
        <button className="btn" onClick={() => applyTheme(primary, accent)}>תצוגה מקדימה</button>
        <button className="btn" onClick={() => {
          localStorage.setItem('demo-brand', JSON.stringify({ primary, accent, logo: logoUrl, companyName, companyId, phone, address }));
          applyTheme(primary, accent);
          setSaved('הצבענו ושמרנו לדמו');
        }}>שמור (דמו)</button>
      </div>
      {saved && <span style={{ color:'var(--color-muted)' }}>{saved}</span>}
    </section>
  );
}


