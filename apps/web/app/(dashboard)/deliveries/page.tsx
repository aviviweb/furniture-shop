"use client";
import { useState } from 'react';
import { apiPost } from '../../../lib/api';
import { showToast } from '../../toast';

export const dynamic = 'force-dynamic';

export default function DeliveriesPage() {
  const [result, setResult] = useState('');
  return (
    <section className="card" style={{ display: 'grid', gap: 12 }}>
      <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>משלוחים/הרכבות</h1>
      <p style={{ margin: 0, color: 'var(--color-muted)' }}>לחץ לחשב מסלול דמו.</p>
      <button className="btn" onClick={async () => {
        try {
          const res = await apiPost('/deliveries/optimize', {
            stops: [
              { id: '1', lat: 32.1, lng: 34.8 },
              { id: '2', lat: 31.8, lng: 35.0 },
            ],
          });
          setResult(JSON.stringify(res));
          showToast('מסלול חושב (דמו)');
        } catch (e: any) {
          setResult(e?.message || 'error');
          showToast('שגיאה בחישוב מסלול');
        }
      }}>חשב מסלול</button>
      <pre style={{ margin: 0 }}>{result}</pre>
    </section>
  );
}


