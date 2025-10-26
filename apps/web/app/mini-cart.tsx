"use client";
import { useEffect, useState } from 'react';
import { showToast } from './toast';

type CartItem = { productId: string; variantId: string; name?: string; sku?: string; price: number; qty: number; imageUrl?: string };

export function MiniCart({ open, onClose }: { open: boolean; onClose: ()=>void }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const total = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0);

  useEffect(() => {
    if (!open) return;
    try {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]');
      setItems(Array.isArray(stored) ? stored : []);
    } catch {
      setItems([]);
    }
  }, [open]);

  const removeItem = (variantId: string) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const filtered = cart.filter((item: any) => item.variantId !== variantId);
    localStorage.setItem('cart', JSON.stringify(filtered));
    setItems(filtered);
    showToast('Item removed from cart');
    window.dispatchEvent(new Event('storage'));
  };

  const updateQty = (variantId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(variantId);
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find((item: any) => item.variantId === variantId);
    if (item) {
      item.qty = newQty;
      localStorage.setItem('cart', JSON.stringify(cart));
      setItems(cart);
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, height: '100%', width: open ? 360 : 0,
      background: '#fff', borderLeft: '1px solid #e5e7eb', boxShadow: '0 10px 40px rgba(0,0,0,.15)',
      overflow: 'hidden', transition: 'width .25s ease', zIndex: 10000
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding: 12, borderBottom:'1px solid #eee' }}>
        <strong>Cart</strong>
        <button onClick={onClose} style={{ border:'none', background:'transparent', fontSize:20 }}>×</button>
      </div>
      <div style={{ padding: 12, display:'grid', gap: 8 }}>
        {items.length === 0 && <div style={{ color:'#64748b' }}>Cart is empty</div>}
        {items.map((it, idx) => (
          <div key={idx} style={{ display:'flex', gap:8, borderBottom:'1px solid #f1f5f9', paddingBottom:8 }}>
            {it.imageUrl && (
              <img 
                src={it.imageUrl} 
                alt={it.name || 'Product'} 
                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
              />
            )}
            <div style={{ flex: 1, display:'grid', gap:4 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{it.name || it.sku || it.variantId}</span>
                <button 
                  onClick={() => removeItem(it.variantId)}
                  style={{ background:'transparent', border:'none', color:'#ef4444', cursor:'pointer', fontSize:16 }}
                >
                  ×
                </button>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <button 
                    onClick={() => updateQty(it.variantId, it.qty - 1)}
                    style={{ width:24, height:24, border:'1px solid #e5e7eb', background:'#fff', borderRadius:4, cursor:'pointer' }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: 20, textAlign:'center' }}>{it.qty}</span>
                  <button 
                    onClick={() => updateQty(it.variantId, it.qty + 1)}
                    style={{ width:24, height:24, border:'1px solid #e5e7eb', background:'#fff', borderRadius:4, cursor:'pointer' }}
                  >
                    +
                  </button>
                </div>
                <span style={{ fontWeight: 600 }}>{(it.price * it.qty).toLocaleString()} ₪</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', padding: 12, borderTop:'1px solid #eee' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 8 }}>
          <span>Total</span>
          <strong>{total.toLocaleString()} ₪</strong>
        </div>
        <a href="/store/cart" style={{ display:'block', textAlign:'center', padding:10, background:'#0ea5e9', color:'#fff', borderRadius:8 }}>Go to Cart</a>
      </div>
    </div>
  );
}


