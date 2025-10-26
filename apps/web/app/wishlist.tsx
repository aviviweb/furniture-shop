"use client";
import { useEffect, useState } from 'react';
import { showToast } from './toast';

type WishlistItem = { productId: string; name?: string; imageUrl?: string; price?: number; sku?: string };

export function WishlistButton({ productId, name, imageUrl, price, sku }: WishlistItem) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.some((item: any) => item.productId === productId));
  }, [productId]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const existingIndex = wishlist.findIndex((item: any) => item.productId === productId);
    
    if (existingIndex >= 0) {
      wishlist.splice(existingIndex, 1);
      showToast('Removed from wishlist');
    } else {
      wishlist.push({ productId, name, imageUrl, price, sku });
      showToast('Added to wishlist');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <button
      onClick={toggleWishlist}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: 20,
        color: isWishlisted ? '#ef4444' : '#64748b',
        transition: 'color 0.2s'
      }}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isWishlisted ? '❤️' : '🤍'}
    </button>
  );
}

export function WishlistBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setCount(wishlist.length);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  if (count === 0) return null;

  return (
    <span style={{
      minWidth: 18,
      height: 18,
      padding: '0 6px',
      background: '#ef4444',
      color: '#fff',
      borderRadius: 999,
      fontSize: 12,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4
    }}>
      {count}
    </span>
  );
}
