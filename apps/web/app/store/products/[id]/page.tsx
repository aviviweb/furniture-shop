"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet } from '../../../lib/api';
import { showToast } from '../../toast';
import { WishlistButton } from '../../../wishlist';
import { RecentlyViewed, ProductRecommendations } from '../../../recommendations';
import { ReviewForm, ReviewList } from '../../../reviews';

type Variant = { id: string; sku: string; price: number; stock?: number };
type Product = { id: string; name: string; description?: string; imageUrl?: string; variants?: Variant[] };

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    apiGet<Product[]>('/products').then(list => {
      const found = list.find(p => p.id === productId) || list[0] || null;
      setProduct(found);
      
      // Track recently viewed
      if (found) {
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const filtered = recent.filter((item: any) => item.productId !== found.id);
        filtered.unshift({ 
          productId: found.id, 
          name: found.name, 
          imageUrl: found.imageUrl, 
          price: found.variants?.[0]?.price,
          viewedAt: Date.now()
        });
        localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10))); // Keep last 10
      }
    });
  }, [productId]);

  function addToCart() {
    if (!product || !product.variants?.[0]) {
      showToast('Error: Product variant not found.');
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
    showToast(`${product.name} added to cart!`);
    window.dispatchEvent(new Event('storage'));
  }

  if (!product) return <main style={{ padding: 24 }}>Loading...</main>;
  return (
    <main style={{ padding: 24 }}>
      {product.imageUrl && (
        <div style={{ maxWidth: 900, margin:'0 auto 16px', borderRadius: 12, overflow:'hidden' }}>
          <img src={product.imageUrl} alt={product.name} style={{ width:'100%', height:'auto', display:'block' }} />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>{product.name}</h1>
        <WishlistButton 
          productId={product.id} 
          name={product.name} 
          imageUrl={product.imageUrl} 
          price={product.variants?.[0]?.price} 
          sku={product.variants?.[0]?.sku} 
        />
      </div>
      <p style={{ color: '#666', marginBottom: 24 }}>{product.description}</p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
        <span style={{ fontWeight: 600, fontSize: 20 }}>{product.variants?.[0]?.price?.toLocaleString?.()} ₪</span>
        <button onClick={addToCart} style={{ padding: '12px 24px', background: '#0ea5e9', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 16 }}>
          Add to Cart
        </button>
      </div>
      
      <RecentlyViewed />
      <ProductRecommendations currentProductId={productId} />
      
      <ReviewList productId={productId} key={refreshReviews} />
      <ReviewForm productId={productId} onReviewAdded={() => setRefreshReviews(prev => prev + 1)} />
    </main>
  );
}
