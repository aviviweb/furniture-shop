"use client";
import React from 'react';
import Link from 'next/link';
import { CartBadge } from './CartBadge';
import { MiniCart } from './mini-cart';
import { WishlistBadge } from './wishlist';
import { LangSwitcher } from './LangSwitcher';

export function ClientShell({ children, brandName, primary, text }: { children: React.ReactNode; brandName: string; primary: string; text: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 16px', background:'#f7f7f7', borderBottom:'1px solid #eee' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:10, height:10, background: primary, borderRadius: '50%' }} />
          <strong>{brandName}</strong>
        </div>
        <nav style={{ display:'flex', gap:16, alignItems:'center' }}>
          <Link href="/" style={{ color:text }}>לוח בקרה</Link>
          <Link href="/store" style={{ color:primary }}>חנות</Link>
          <Link href="/store/wishlist" style={{ color:text, display:'flex', alignItems:'center', gap:4 }}>
            רשימת משאלות
            <WishlistBadge />
          </Link>
          <Link href="/store/orders" style={{ color:text }}>הזמנות</Link>
          <CartBadge onOpen={()=> setOpen(true)} />
        </nav>
        <LangSwitcher />
      </div>
      <MiniCart open={open} onClose={()=> setOpen(false)} />
      {children}
    </>
  );
}
