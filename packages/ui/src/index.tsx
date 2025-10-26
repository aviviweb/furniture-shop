import React from 'react';

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 16,
      background: 'white',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
    }}>
      {children}
    </div>
  );
}

export function StatusDot({ color }: { color: string }) {
  return <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 9999, background: color }} />;
}


