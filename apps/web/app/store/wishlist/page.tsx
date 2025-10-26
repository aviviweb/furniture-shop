"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '../../lib/api';

type WishlistItem = { productId: string; name?: string; imageUrl?: string; price?: number; sku?: string };

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(stored);
    apiGet('/products').then(setProducts).catch(() => setProducts([]));
  }, []);

  const removeFromWishlist = (productId: string) => {
    const filtered = wishlist.filter(item => item.productId !== productId);
    localStorage.setItem('wishlist', JSON.stringify(filtered));
    setWishlist(filtered);
    window.dispatchEvent(new Event('storage'));
  };

  const addToCart = (item: WishlistItem) => {
    const product = products.find(p => p.id === item.productId);
    if (!product?.variants?.[0]) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((cartItem: any) => cartItem.variantId === product.variants[0].id);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({
        productId: product.id,
        variantId: product.variants[0].id,
        name: product.name,
        sku: product.variants[0].sku,
        price: product.variants[0].price,
        qty: 1,
        imageUrl: product.imageUrl,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
          <p>Your wishlist is empty</p>
          <Link href="/store/products" style={{ display: 'inline-block', marginTop: 16, padding: '12px 24px', background: '#0ea5e9', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 16 }}>
          {wishlist.map((item, idx) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;
            
            return (
              <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                {item.imageUrl && (
                  <div style={{ position:'relative', paddingTop:'62%', background:'#f6f7f8' }}>
                    <img src={item.imageUrl} alt={item.name} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                )}
                <div style={{ padding: 12 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>{item.name}</h3>
                  <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: 14 }}>{product.variants?.[0]?.price?.toLocaleString?.()} ₪</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      onClick={() => addToCart(item)}
                      style={{ flex: 1, padding: '8px 12px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item.productId)}
                      style={{ padding: '8px 12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
