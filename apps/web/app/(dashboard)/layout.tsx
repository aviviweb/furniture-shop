import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderLeft: '1px solid #e5e7eb', padding: 16, background: '#fff' }}>
        <nav>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
            {[
              { href: '/', label: 'דשבורד' },
              { href: '/products', label: 'מוצרים' },
              { href: '/inventory', label: 'מלאי' },
              { href: '/orders', label: 'הזמנות' },
              { href: '/invoices', label: 'חשבוניות' },
              { href: '/expenses', label: 'הוצאות' },
              { href: '/deliveries', label: 'משלוחים/הרכבות' },
              { href: '/installer', label: 'אזור מתקין' },
              { href: '/settings/branding', label: 'מיתוג' },
              { href: '/superadmin', label: 'Super Admin' },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <section style={{ padding: 24 }}>{children}</section>
    </div>
  );
}


