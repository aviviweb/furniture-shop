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

// Make root layout synchronous to avoid clientModules error
// API calls are now handled in ClientShell component
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <div id="toast-root" style={{ position:'fixed', top:16, right:16, display:'grid', gap:8, zIndex:9999 }} />
          <ClientShell>
            {children}
          </ClientShell>
        </I18nProvider>
      </body>
    </html>
  );
}



