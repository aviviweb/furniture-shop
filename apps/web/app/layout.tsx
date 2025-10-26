import React from 'react';
import './globals.css';
import { Heebo } from 'next/font/google';
import { I18nProvider } from './i18n';
import { LangSwitcher } from './LangSwitcher';
import Link from 'next/link';
import { CartBadge } from './CartBadge';
import { MiniCart } from './mini-cart';
import { WishlistBadge } from './wishlist';
import { useState } from 'react';

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

function ClientShell({ children, brandName, primary, text }: { children: React.ReactNode; brandName: string; primary: string; text: string }) {
  'use client';
  const [open, setOpen] = useState(false);
  return (
    <>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 16px', background:'#f7f7f7', borderBottom:'1px solid #eee' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:10, height:10, background: primary, borderRadius: '50%' }} />
          <strong>{brandName}</strong>
        </div>
        <nav style={{ display:'flex', gap:16, alignItems:'center' }}>
          <Link href="/" style={{ color:text }}>Dashboard</Link>
          <Link href="/store" style={{ color:primary }}>Storefront</Link>
          <Link href="/store/wishlist" style={{ color:text, display:'flex', alignItems:'center', gap:4 }}>
            Wishlist
            <WishlistBadge />
          </Link>
          <Link href="/store/orders" style={{ color:text }}>Orders</Link>
          <CartBadge onOpen={()=> setOpen(true)} />
        </nav>
        <LangSwitcher />
      </div>
      <MiniCart open={open} onClose={()=> setOpen(false)} />
      {children}
    </>
  );
}


