"use client";
import { useState } from 'react';
import { apiPost } from '../../../lib/api';
import { showToast } from '../../toast';
import { downloadCSV } from '../../csv';

type SalesReport = {
  type: 'sales';
  period: { from: Date; to: Date };
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  };
  monthly: Array<{ month: string; orders: number; revenue: number }>;
};

type InventoryReport = {
  type: 'inventory';
  summary: {
    totalItems: number;
    lowStockItems: number;
    totalValue: number;
  };
  byLocation: Array<{ location: string; items: number; value: number }>;
  lowStock: Array<{ sku: string; name: string; quantity: number; minThreshold: number }>;
};

type FinanceReport = {
  type: 'finance';
  period: { from: Date; to: Date };
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    profitMargin: number;
  };
  revenue: Array<{ month: string; revenue: number; expenses: number }>;
};

type Report = SalesReport | InventoryReport | FinanceReport;

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  async function run(type: string) {
    try {
      setLoading(true);
      const body: any = { type };
      if (dateFrom) body.dateFrom = dateFrom;
      if (dateTo) body.dateTo = dateTo;
      const res = await apiPost<Report>('/reports/generate', body);
      setReport(res);
      showToast(`דוח ${type} הופעל בהצלחה`);
    } catch (e: any) {
      console.error('Failed to generate report:', e);
      showToast('שגיאה בהפעלת הדוח');
    } finally {
      setLoading(false);
    }
  }

  const maxValue = (report: Report) => {
    if (report.type === 'sales') {
      return Math.max(...report.monthly.map(m => m.revenue), 1);
    }
    if (report.type === 'finance') {
      return Math.max(...report.revenue.map(r => Math.max(r.revenue, r.expenses)), 1);
    }
    return 1;
  };

  return (
    <section className="card" style={{ display: 'grid', gap: 16 }}>
      <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 0 }}>דוחות</h1>

      {/* Date Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="מתאריך"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="עד תאריך"
        />
        <button className="btn" onClick={() => { setDateFrom(''); setDateTo(''); }}>
          נקה תאריכים
        </button>
      </div>

      {/* Report Buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => run('sales')} disabled={loading}>
          {loading ? 'טוען...' : 'דוח מכירות'}
        </button>
        <button className="btn" onClick={() => run('inventory')} disabled={loading}>
          {loading ? 'טוען...' : 'דוח מלאי'}
        </button>
        <button className="btn" onClick={() => run('finance')} disabled={loading}>
          {loading ? 'טוען...' : 'דוח כספי'}
        </button>
      </div>

      {/* Sales Report */}
      {report && report.type === 'sales' && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>דוח מכירות</h2>
          
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{report.summary.totalOrders}</div>
              <div style={{ color: 'var(--color-muted)' }}>סה"כ הזמנות</div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>₪{report.summary.totalRevenue.toLocaleString('he-IL')}</div>
              <div style={{ color: 'var(--color-muted)' }}>סה"כ הכנסות</div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>₪{Math.round(report.summary.averageOrderValue).toLocaleString('he-IL')}</div>
              <div style={{ color: 'var(--color-muted)' }}>ממוצע הזמנה</div>
            </div>
          </div>

          {/* Monthly Chart */}
          <div style={{ marginBottom: 24 }}>
            <h3>מכירות חודשיות</h3>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${report.monthly.length}, 1fr)`, gap: 8, alignItems: 'end', height: 200, background: '#fafafa', padding: 16, borderRadius: 8 }}>
              {report.monthly.map((m, idx) => (
                <div key={idx} style={{ display: 'grid', alignContent: 'end', gap: 4 }}>
                  <div
                    style={{
                      background: 'rgba(14,165,233,0.6)',
                      height: Math.max(10, Math.round((m.revenue / maxValue(report)) * 180)),
                      borderRadius: 4,
                      minHeight: 10,
                    }}
                    title={`${m.month}: ₪${m.revenue.toLocaleString('he-IL')}`}
                  />
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', textAlign: 'center' }}>
                    {m.month.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-muted)', textAlign: 'center' }}>
                    ₪{(m.revenue / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div>
            <h3>מוצרים מובילים</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>מוצר</th>
                  <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>כמות</th>
                  <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>הכנסות</th>
                </tr>
              </thead>
              <tbody>
                {report.summary.topProducts.map((product, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{product.name}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{product.quantity}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>₪{product.revenue.toLocaleString('he-IL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 16 }}>
            <button className="btn" onClick={() => downloadCSV('sales-report.csv', report.monthly as any)}>
              ייצוא CSV
            </button>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {report && report.type === 'inventory' && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>דוח מלאי</h2>
          
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{report.summary.totalItems}</div>
              <div style={{ color: 'var(--color-muted)' }}>סה"כ פריטים</div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: report.summary.lowStockItems > 0 ? '#ef4444' : '#10b981' }}>
                {report.summary.lowStockItems}
              </div>
              <div style={{ color: 'var(--color-muted)' }}>מלאי נמוך</div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>₪{report.summary.totalValue.toLocaleString('he-IL')}</div>
              <div style={{ color: 'var(--color-muted)' }}>ערך כולל</div>
            </div>
          </div>

          {/* By Location */}
          {report.byLocation.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3>לפי מיקום</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>מיקום</th>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>פריטים</th>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>ערך</th>
                  </tr>
                </thead>
                <tbody>
                  {report.byLocation.map((loc, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{loc.location}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{loc.items}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>₪{loc.value.toLocaleString('he-IL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Low Stock */}
          {report.lowStock.length > 0 && (
            <div>
              <h3>מלאי נמוך</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>SKU</th>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>מוצר</th>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>כמות</th>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>סף מינימום</th>
                  </tr>
                </thead>
                <tbody>
                  {report.lowStock.map((item, idx) => (
                    <tr key={idx} style={{ background: '#fef2f2' }}>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{item.sku}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{item.name}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9', color: '#ef4444' }}>{item.quantity}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{item.minThreshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <button className="btn" onClick={() => downloadCSV('inventory-report.csv', report.lowStock as any)}>
              ייצוא CSV
            </button>
          </div>
        </div>
      )}

      {/* Finance Report */}
      {report && report.type === 'finance' && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>דוח כספי</h2>
          
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#10b981' }}>
                ₪{report.summary.totalRevenue.toLocaleString('he-IL')}
              </div>
              <div style={{ color: 'var(--color-muted)' }}>הכנסות</div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ef4444' }}>
                ₪{report.summary.totalExpenses.toLocaleString('he-IL')}
              </div>
              <div style={{ color: 'var(--color-muted)' }}>הוצאות</div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: report.summary.profit > 0 ? '#10b981' : '#ef4444' }}>
                ₪{report.summary.profit.toLocaleString('he-IL')}
              </div>
              <div style={{ color: 'var(--color-muted)' }}>רווח</div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                {report.summary.profitMargin.toFixed(1)}%
              </div>
              <div style={{ color: 'var(--color-muted)' }}>שולי רווח</div>
            </div>
          </div>

          {/* Revenue vs Expenses Chart */}
          <div>
            <h3>הכנסות מול הוצאות</h3>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${report.revenue.length}, 1fr)`, gap: 8, alignItems: 'end', height: 200, background: '#fafafa', padding: 16, borderRadius: 8 }}>
              {report.revenue.map((r, idx) => (
                <div key={idx} style={{ display: 'grid', alignContent: 'end', gap: 4 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                    <div
                      style={{
                        background: '#10b981',
                        height: Math.max(5, Math.round((r.revenue / maxValue(report)) * 90)),
                        width: '60%',
                        borderRadius: 4,
                        minHeight: 5,
                      }}
                      title={`הכנסות: ₪${r.revenue.toLocaleString('he-IL')}`}
                    />
                    <div
                      style={{
                        background: '#ef4444',
                        height: Math.max(5, Math.round((r.expenses / maxValue(report)) * 90)),
                        width: '60%',
                        borderRadius: 4,
                        minHeight: 5,
                      }}
                      title={`הוצאות: ₪${r.expenses.toLocaleString('he-IL')}`}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', textAlign: 'center' }}>
                    {r.month.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, background: '#10b981', borderRadius: 2 }} />
                <span style={{ fontSize: 12 }}>הכנסות</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, background: '#ef4444', borderRadius: 2 }} />
                <span style={{ fontSize: 12 }}>הוצאות</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <button className="btn" onClick={() => downloadCSV('finance-report.csv', report.revenue as any)}>
              ייצוא CSV
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
