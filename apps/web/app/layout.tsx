import React from 'react';
import './globals.css';
import { Heebo } from 'next/font/google';
import { I18nProvider } from './i18n';
import { ClientShell } from './ClientShell';

const heebo = Heebo({ subsets: ['hebrew', 'latin'], weight: ['400', '500', '700'] });

export const metadata = {
  title: 'מרכז הניהול המקצועי',
  description: 'מערכת SaaS לרהיטים - RTL',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // layout is a server component by default; but we used client hooks already.
  // Switch to client by lifting to a wrapper if needed. Simpler: render client-only parts inside a small wrapper.
  // For now, use a local state via a small client island below.
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Furniture Demo';
  const primary = process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#0ea5e9';
  const text = '#0f172a';
  return (
    <html lang="he" dir="rtl" className={heebo.className}>
      <head>
        <style>{`
          :root {
            --color-primary: ${primary};
          }
        `}</style>
      </head>
      <body style={{ color: text }}>
        <I18nProvider>
          <div id="toast-root" style={{ position:'fixed', top:16, left:16, display:'grid', gap:8, zIndex:9999 }} />
          <ClientShell brandName={brandName} primary={primary} text={text}>
            {children}
          </ClientShell>
        </I18nProvider>
      </body>
    </html>
  );
}



