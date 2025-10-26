"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '../../lib/api';

type Product = { id: string; name: string; description?: string; imageUrl?: string; variants?: any[]; category?: string };

export function RecentlyViewed() {
  const [recent, setRecent] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const recentItems = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecent(recentItems.slice(0, 4)); // Show last 4
    
    apiGet<Product[]>('/products').then(setProducts).catch(() => setProducts([]));
  }, []);

  if (recent.length === 0) return null;

  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ marginBottom: 16 }}>Recently Viewed</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {recent.map((item, idx) => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;
          
          return (
            <Link key={idx} href={`/store/products/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                )}
                <div style={{ padding: 12 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 14 }}>{product.name}</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>{product.variants?.[0]?.price?.toLocaleString?.()} ₪</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ProductRecommendations({ currentProductId }: { currentProductId?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    apiGet<Product[]>('/products').then(allProducts => {
      setProducts(allProducts);
      
      // Simple recommendation: same category, excluding current product
      const current = allProducts.find(p => p.id === currentProductId);
      if (current?.category) {
        const sameCategory = allProducts.filter(p => 
          p.category === current.category && p.id !== currentProductId
        );
        setRecommendations(sameCategory.slice(0, 4));
      } else {
        // Fallback: random products
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 4));
      }
    }).catch(() => setProducts([]));
  }, [currentProductId]);

  if (recommendations.length === 0) return null;

  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ marginBottom: 16 }}>You Might Also Like</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {recommendations.map((product) => (
          <Link key={product.id} href={`/store/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
              )}
              <div style={{ padding: 12 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 14 }}>{product.name}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>{product.variants?.[0]?.price?.toLocaleString?.()} ₪</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
