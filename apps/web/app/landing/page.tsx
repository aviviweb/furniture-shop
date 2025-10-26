"use client";
import Link from 'next/link';

export default function LandingPage() {
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Furniture Demo';
  const primary = process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#0ea5e9';
  return (
    <main style={{ padding: 24 }}>
      <section style={{ padding: '40px 0' }}>
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>מערכת SaaS לחנויות רהיטים</h1>
        <p style={{ color: '#475569' }}>{brand}: דמו מלא, חנות אונליין, ניהול, חשבוניות, משלוחים ודוחות – הכל במקום אחד.</p>
        <div style={{ display:'flex', gap:12, marginTop:16 }}>
          <Link href="/store" style={{ padding: 12, background:primary, color:'#fff', borderRadius:8 }}>כנסו לדמו</Link>
          <Link href="/login" style={{ padding: 12, background:'#0f172a', color:'#fff', borderRadius:8 }}>התחברות למערכת</Link>
        </div>
      </section>
      <section style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12, marginTop:24 }}>
        {[
          { t: 'ניהול מלאי ומוצרים', d: 'וריאנטים, סטוקים וקטלוג גמיש' },
          { t: 'הזמנות וחשבוניות', d: 'מספור רציף, מע״מ ומסמכים' },
          { t: 'משלוחים והתקנות', d: 'אופטימיזציית מסלולים דמו' },
          { t: 'דוחות ו-NOTIFY', d: 'דוחות דמו ונוטיפיקציות' },
        ].map((f, i) => (
          <div key={i} style={{ border:'1px solid #eee', borderRadius:8, padding:12 }}>
            <h3 style={{ margin:'8px 0' }}>{f.t}</h3>
            <p style={{ color:'#64748b' }}>{f.d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
