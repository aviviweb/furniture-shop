"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiGet } from '../../../lib/api';
import { showToast } from '../../toast';
import { WishlistButton } from '../../wishlist';

type Variant = { id: string; sku: string; price: number; stock?: number };
type Product = { id: string; name: string; description?: string; imageUrl?: string; variants?: Variant[] };

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  useEffect(() => {
    // Only show available products (with stock > 0)
    apiGet<Product[]>('/products?onlyAvailable=true')
      .then((products) => {
        // Filter variants to only show those with stock > 0
        const filtered = products.map(p => ({
          ...p,
          variants: p.variants?.filter(v => (v.stock ?? 0) > 0),
        })).filter(p => p.variants && p.variants.length > 0);
        setItems(filtered);
      })
      .catch((error) => {
        console.error('Failed to load products:', error);
        setItems([]);
      });
  }, []);
  const filtered = items.filter(p => {
    const matchesQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.description||'').toLowerCase().includes(q.toLowerCase());
    const matchesC = !category || (p as any).category === category;
    return matchesQ && matchesC;
  });

  const addToCart = (product: Product) => {
    try {
      if (!product.variants?.[0]) {
        showToast('שגיאה: לא נמצא גרסת מוצר.');
        return;
      }
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item: any) => item.variantId === product.variants?.[0]?.id);
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
      showToast(`${product.name} נוסף לעגלה!`);
      // Trigger storage event for CartBadge update
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast('שגיאה בהוספה לעגלה');
    }
  };
  return (
    <main style={{ padding: 24 }}>
      <h1>מוצרים</h1>
      <div style={{ display:'flex', gap:12, marginTop: 8, marginBottom: 12 }}>
        <input value={q} onChange={e=> setQ(e.target.value)} placeholder="חיפוש..." style={{ padding:8, border:'1px solid #e5e7eb', borderRadius:8 }} />
        <select value={category} onChange={e=> setCategory(e.target.value)} style={{ padding:8, border:'1px solid #e5e7eb', borderRadius:8 }}>
          <option value="">כל הקטגוריות</option>
          <option value="ספות">ספות</option>
          <option value="סלון">סלון</option>
          <option value="שולחנות">שולחנות</option>
          <option value="כיסאות">כיסאות</option>
          <option value="ארונות">ארונות</option>
        </select>
      </div>
      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 16 }}>
        {filtered.map(p => (
          <li key={p.id} style={{ border: '1px solid #eee', borderRadius: 8, overflow:'hidden', background:'#fff' }}>
            {p.imageUrl && (
              <div style={{ position:'relative', paddingTop:'62%', background:'#f6f7f8' }}>
                {/* simple responsive ratio box */}
                <img src={p.imageUrl} alt={p.name} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
            )}
            <div style={{ padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>{p.name}</h3>
                <WishlistButton 
                  productId={p.id} 
                  name={p.name} 
                  imageUrl={p.imageUrl} 
                  price={p.variants?.[0]?.price} 
                  sku={p.variants?.[0]?.sku} 
                />
              </div>
            <p style={{ color: '#666', minHeight: 40, fontSize: 14 }}>{p.description || ''}</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>{p.variants?.[0]?.price?.toLocaleString?.() || ''} ₪</span>
              <button 
                onClick={() => addToCart(p)}
                disabled={!p.variants?.[0] || (p.variants[0].stock ?? 0) <= 0}
                style={{ 
                  padding: '6px 12px', 
                  background: (!p.variants?.[0] || (p.variants[0].stock ?? 0) <= 0) ? '#ccc' : '#0ea5e9', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 4, 
                  cursor: (!p.variants?.[0] || (p.variants[0].stock ?? 0) <= 0) ? 'not-allowed' : 'pointer',
                  fontSize: 12
                }}
              >
                {(!p.variants?.[0] || (p.variants[0].stock ?? 0) <= 0) ? 'אזל מהמלאי' : 'הוסף לעגלה'}
              </button>
              <Link href={`/store/products/${p.id}`} style={{ marginLeft: 'auto', color: '#0ea5e9', fontSize: 14 }}>צפייה</Link>
            </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
