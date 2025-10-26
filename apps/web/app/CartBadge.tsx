"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function CartBadge({ onOpen }: { onOpen?: ()=> void }) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const read = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCount(Array.isArray(cart) ? cart.reduce((s: number, it: any) => s + (Number(it.qty) || 0), 0) : 0);
      } catch {
        setCount(0);
      }
    };
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === 'cart') read(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0f172a' }}>
      <button onClick={onOpen} style={{ background:'transparent', border:'none', color:'inherit', cursor: 'pointer' }}>Cart</button>
      <Link href="/store/cart" style={{ textDecoration:'none' }}>
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
          justifyContent: 'center'
        }}>{count}</span>
      </Link>
    </div>
  );
}


