import React from 'react';
import './globals.css';
import { Heebo } from 'next/font/google';
import { I18nProvider } from './i18n';
import { ClientShell } from './ClientShell';
import { headers } from 'next/headers';
import { loadTenantSettings } from '../lib/tenant';

const heebo = Heebo({ subsets: ['hebrew', 'latin'], weight: ['400', '500', '700'] });

export const metadata = {
  title: 'מרכז הניהול המקצועי',
  description: 'מערכת SaaS לרהיטים - RTL',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Get tenant ID from headers (set by middleware)
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id') || process.env.NEXT_PUBLIC_TENANT_ID || 'furniture-demo';
  
  // Load tenant settings from API
  const tenantSettings = await loadTenantSettings(tenantId);
  
  const brandName = tenantSettings.brandName;
  const primary = tenantSettings.primaryColor;
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



