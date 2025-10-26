'use client';
import React, { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';

export function DemoBanner() {
  const [demo, setDemo] = useState<boolean>(false);
  useEffect(() => {
    apiGet<any>('/companies/me').then(c => setDemo(!!c?.demoMode)).catch(() => {});
  }, []);
  if (!demo) return null;
  return (
    <div style={{ background: '#fef3c7', padding: 8, border: '1px solid #f59e0b', borderRadius: 8, marginBottom: 12 }}>
      מצב דמו פעיל — נתונים ושרותים רצים ב־Mock
    </div>
  );
}


