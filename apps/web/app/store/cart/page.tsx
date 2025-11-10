"use client";
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { showToast } from '../../toast';
import { ShippingCalculator } from '../../shipping-calculator';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  useEffect(() => {
    const c = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(c);
  }, []);
  const total = useMemo(() => cart.reduce((s, i) => s + (i.qty || 0) * (i.price || 0), 0), [cart]);

  const updateQty = (variantId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(variantId);
      return;
    }
    const updated = cart.map(item => 
      item.variantId === variantId ? { ...item, qty: newQty } : item
    );
    localStorage.setItem('cart', JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (variantId: string) => {
    const filtered = cart.filter(item => item.variantId !== variantId);
    localStorage.setItem('cart', JSON.stringify(filtered));
    setCart(filtered);
    showToast('הפריט הוסר מהעגלה');
    window.dispatchEvent(new Event('storage'));
  };
  return (
    <main style={{ padding: 24 }}>
      <h1>העגלה שלך</h1>
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
          <p>העגלה שלך ריקה</p>
          <Link href="/store/products" style={{ display: 'inline-block', marginTop: 16, padding: '12px 24px', background: '#0ea5e9', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
            המשך לקנות
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 16, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name || 'Product'} 
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>{item.name || item.sku || item.variantId}</h3>
                  <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: 14 }}>SKU: {item.sku}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button 
                        onClick={() => updateQty(item.variantId, item.qty - 1)}
                        style={{ width: 32, height: 32, border: '1px solid #e5e7eb', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 500 }}>{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.variantId, item.qty + 1)}
                        style={{ width: 32, height: 32, border: '1px solid #e5e7eb', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{(item.price * item.qty).toLocaleString()} ₪</span>
                      <button 
                        onClick={() => removeItem(item.variantId)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18 }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 20, background: '#f8fafc', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>סה"כ</span>
              <span style={{ fontSize: 24, fontWeight: 700 }}>{total.toLocaleString()} ₪</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/store/products" style={{ padding: '12px 24px', color: '#0ea5e9', border: '1px solid #0ea5e9', borderRadius: 8, textDecoration: 'none' }}>
                המשך לקנות
              </Link>
              <Link href="/store/checkout" style={{ padding: '12px 24px', background: '#10b981', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
                היכנס לתשלום
              </Link>
            </div>
          </div>
          
          <ShippingCalculator cartItems={cart} />
        </>
      )}
    </main>
  );
}
