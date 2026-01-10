"use client";
import React from 'react';
import Link from 'next/link';
import { CartBadge } from './CartBadge';
import { MiniCart } from './mini-cart';
import { WishlistBadge } from './wishlist';
import { LangSwitcher } from './LangSwitcher';
import { getTenantId } from '../lib/tenant';
import { getApiBase } from '../lib/api';

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [brandName, setBrandName] = React.useState(process.env.NEXT_PUBLIC_BRAND_NAME || 'Furniture Demo');
  const [primary, setPrimary] = React.useState(process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#0ea5e9');
  const text = '#0f172a';
  
  // Load tenant settings on client side to avoid blocking the layout
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const tenantId = getTenantId();
        const apiBase = getApiBase();
        const response = await fetch(`${apiBase}/companies/me`, {
          headers: { 'x-tenant-id': tenantId },
          cache: 'no-store',
        });
        if (response.ok) {
          const company = await response.json();
          if (company.brand?.primaryColor) {
            setPrimary(company.brand.primaryColor);
            setBrandName(company.name);
            // Update CSS variable
            document.documentElement.style.setProperty('--color-primary', company.brand.primaryColor);
          }
        } else {
          // 404 or other error - silently use defaults
          // Don't log 404 as it's expected if API is not available
          if (response.status !== 404) {
            console.warn('Failed to load tenant settings:', response.status);
          }
        }
      } catch (error) {
        // Network error or other - silently fail and use defaults
        // This is expected if API is not available
      }
    };
    loadSettings();
  }, []);
  
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
