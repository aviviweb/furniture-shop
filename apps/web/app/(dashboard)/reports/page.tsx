"use client";
import { useMemo, useState } from 'react';
import { apiPost } from '../../../lib/api';
import { showToast } from '../../toast';
import { downloadCSV } from '../../csv';

type Row = { label: string; value: number };

export default function ReportsPage() {
  const [result, setResult] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [kind, setKind] = useState('');
  async function run(type: string) {
    try {
      const res = await apiPost('/reports/generate', { reportType: type });
      setResult(JSON.stringify(res));
      setKind(type);
      // demo dataset
      const demo: Row[] = Array.from({ length: 6 }).map((_, i) => ({ label: `חודש ${i+1}`, value: Math.round(500 + Math.random()*1500) }));
      setRows(demo);
      showToast(`דוח ${type} הופעל (דמו)`);
    } catch (e: any) {
      setResult(e?.message || 'error');
      showToast('שגיאה בהפעלת הדוח');
    }
  }
  return (
    <section className="card" style={{ display:'grid', gap: 12 }}>
      <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>דוחות</h1>
      <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
        <button className="btn" onClick={()=> run('sales')}>דוח מכירות</button>
        <button className="btn" onClick={()=> run('inventory')}>דוח מלאי</button>
        <button className="btn" onClick={()=> run('finance')}>דוח כספי</button>
      </div>
      {rows.length>0 && (
        <>
          <div style={{ display:'flex', gap: 8, alignItems:'center' }}>
            <strong>תוצאות (דמו): {kind}</strong>
            <button className="btn" onClick={()=> downloadCSV(`${kind||'report'}.csv`, rows as any)}>ייצוא CSV</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, alignItems:'end', height:160, background:'#fafafa', padding:12, borderRadius:12, border:'1px solid #e5e7eb' }}>
            {rows.map((r, idx)=> (
              <div key={idx} style={{ display:'grid', alignContent:'end', gap:4 }}>
                <div style={{ background:'rgba(14,165,233,0.35)', height: Math.max(10, Math.round((r.value/2000)*140)), borderRadius:6 }} />
                <div style={{ fontSize:12, color:'var(--color-muted)', textAlign:'center' }}>{r.label}</div>
              </div>
            ))}
          </div>
        </>
      )}
      <pre style={{ margin:0 }}>{result}</pre>
    </section>
  );
}


