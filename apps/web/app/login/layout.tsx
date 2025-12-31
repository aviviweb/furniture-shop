import React from 'react';
import '../globals.css';
import { Heebo } from 'next/font/google';
import { I18nProvider } from '../i18n';

const heebo = Heebo({ subsets: ['hebrew', 'latin'], weight: ['400', '500', '700'] });

export const metadata = {
  title: 'כניסה - מרכז הניהול המקצועי',
  description: 'התחברות למערכת',
};

// This layout is independent and doesn't call the API
// It's used only for the /login route to avoid API dependency issues
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.className}>
      <head>
        <style>{`
          :root {
            --color-primary: #0ea5e9;
          }
        `}</style>
      </head>
      <body style={{ color: '#0f172a', margin: 0 }}>
        <I18nProvider>
          <div id="toast-root" style={{ position:'fixed', top:16, right:16, display:'grid', gap:8, zIndex:9999 }} />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}

