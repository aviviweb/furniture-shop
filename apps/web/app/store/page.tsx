"use client";
import Link from 'next/link';
import { apiPost } from '../../lib/api';
import { showToast } from '../toast';
import { EmailNotificationDemo, NotificationSettings } from '../email-notifications';

export default function StoreHome() {
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Furniture Demo';
  const primary = process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#0ea5e9';
  
  const reset = async () => {
    try {
      localStorage.removeItem('cart');
      await apiPost('/superadmin/resetDemo', {});
      showToast('Demo data reset successfully!');
      location.reload();
    } catch (e) {
      console.error(e);
      showToast('Failed to reset demo data');
    }
  };
  
  return (
    <main style={{ padding: 0 }}>
      <section style={{
        background: `linear-gradient(135deg, ${primary}, #10b981)`,
        color:'#fff', padding: '64px 24px', textAlign:'center'
      }}>
        <h1 style={{ fontSize: 40, marginBottom: 12 }}>{brand} Store</h1>
        <p style={{ fontSize: 18, opacity: 0.95 }}>Complete e-commerce demo with orders, payments, and notifications.</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent:'center', flexWrap: 'wrap' }}>
          <Link href="/store/products" style={{ padding: '12px 16px', background: '#0f172a', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>Browse Products</Link>
          <Link href="/store/cart" style={{ padding: '12px 16px', background: 'rgba(255,255,255,.2)', color: '#fff', borderRadius: 8, border:'1px solid rgba(255,255,255,.3)', textDecoration: 'none' }}>View Cart</Link>
          <Link href="/store/orders" style={{ padding: '12px 16px', background: 'rgba(255,255,255,.2)', color: '#fff', borderRadius: 8, border:'1px solid rgba(255,255,255,.3)', textDecoration: 'none' }}>Order History</Link>
          <button onClick={reset} style={{ padding: '12px 16px', background: 'rgba(255,255,255,.2)', color: '#fff', borderRadius: 8, border:'1px solid rgba(255,255,255,.3)', cursor: 'pointer' }}>Reset Demo</button>
        </div>
      </section>
      
      <section style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Demo Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <EmailNotificationDemo />
          <NotificationSettings />
        </div>
      </section>
    </main>
  );
}
