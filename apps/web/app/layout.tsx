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
  // Use a timeout to prevent hanging if API is slow
  let tenantSettings;
  try {
    const headersList = await headers();
    const tenantId = headersList.get('x-tenant-id') || process.env.NEXT_PUBLIC_TENANT_ID || 'furniture-demo';
    
    // Load tenant settings from API (with error handling)
    // Use Promise.race to timeout after 2 seconds
    tenantSettings = await Promise.race([
      loadTenantSettings(tenantId),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 2000)
      )
    ]) as any;
  } catch (error) {
    // Use defaults if API fails or times out
    tenantSettings = {
      brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'Furniture Demo',
      primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#0ea5e9',
      secondaryColor: '#10b981',
      logoUrl: null,
      company: null,
    };
  }
  
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
          <div id="toast-root" style={{ position:'fixed', top:16, right:16, display:'grid', gap:8, zIndex:9999 }} />
          <ClientShell brandName={brandName} primary={primary} text={text}>
            {children}
          </ClientShell>
        </I18nProvider>
      </body>
    </html>
  );
}



