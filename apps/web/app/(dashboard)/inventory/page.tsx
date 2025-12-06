"use client";
import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPatch, apiPost } from '../../../lib/api';
import { showToast } from '../../toast';
import { downloadCSV } from '../../csv';

type InventoryItem = {
  id: string;
  variantId: string;
  sku: string;
  productName: string;
  quantity: number;
  minThreshold: number;
  location?: string;
  status: 'low' | 'ok';
  updatedAt: string;
};

type Movement = {
  id: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';
  quantity: number;
  previousQty: number;
  newQty: number;
  reason?: string;
  referenceId?: string;
  createdAt: string;
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'ok'>('all');
  const [filterLocation, setFilterLocation] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ quantity?: number; minThreshold?: number; location?: string }>({});
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [movementData, setMovementData] = useState<{
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';
    quantity: number;
    reason?: string;
  }>({ type: 'IN', quantity: 0 });

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (selectedVariantId) {
      loadMovements(selectedVariantId);
    }
  }, [selectedVariantId]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await apiGet<InventoryItem[]>('/inventory');
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      showToast('שגיאה בטעינת המלאי');
    } finally {
      setLoading(false);
    }
  };

  const loadMovements = async (variantId: string) => {
    try {
      const data = await apiGet<Movement[]>(`/inventory/movements?variantId=${variantId}`);
      setMovements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load movements:', error);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.productName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'low' && item.status === 'low') ||
        (filterStatus === 'ok' && item.status === 'ok');
      const matchesLocation = 
        !filterLocation || 
        (item.location || '').toLowerCase().includes(filterLocation.toLowerCase());
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [items, search, filterStatus, filterLocation]);

  const handleUpdate = async (variantId: string) => {
    try {
      await apiPatch(`/inventory/${variantId}`, editData);
      showToast('המלאי עודכן בהצלחה');
      setEditingId(null);
      setEditData({});
      loadInventory();
    } catch (error) {
      console.error('Failed to update inventory:', error);
      showToast('שגיאה בעדכון המלאי');
    }
  };

  const handleAddMovement = async () => {
    if (!selectedVariantId) return;
    try {
      await apiPost(`/inventory/${selectedVariantId}/movements`, movementData);
      showToast('תנועת מלאי נוספה בהצלחה');
      setShowMovementForm(false);
      setMovementData({ type: 'IN', quantity: 0 });
      loadInventory();
      loadMovements(selectedVariantId);
    } catch (error: any) {
      console.error('Failed to add movement:', error);
      showToast(error?.message || 'שגיאה בהוספת תנועת מלאי');
    }
  };

  const locations = useMemo(() => {
    const locs = new Set<string>();
    items.forEach(item => {
      if (item.location) locs.add(item.location);
    });
    return Array.from(locs).sort();
  }, [items]);

  if (loading) {
    return (
      <section className="card">
        <p>טוען...</p>
      </section>
    );
  }

  return (
    <section className="card" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 0 }}>מלאי</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => downloadCSV('inventory.csv', filteredItems)}>
            ייצוא CSV
          </button>
          <button className="btn" onClick={() => loadInventory()}>
            רענון
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 180px', gap: 8 }}>
        <input
          placeholder="חיפוש לפי SKU או שם מוצר"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
          <option value="all">כל הסטטוסים</option>
          <option value="low">מלאי נמוך</option>
          <option value="ok">מלאי תקין</option>
        </select>
        <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
          <option value="">כל המיקומים</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>SKU</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>מוצר</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>כמות</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>סף מינימום</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>מיקום</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>סטטוס</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 16, color: 'var(--color-muted)', textAlign: 'center' }}>
                  אין תוצאות
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} style={{ background: item.status === 'low' ? '#fef2f2' : 'transparent' }}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{item.sku}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{item.productName}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    {editingId === item.variantId ? (
                      <input
                        type="number"
                        value={editData.quantity ?? item.quantity}
                        onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value) || 0 })}
                        style={{ width: 80, padding: 4 }}
                      />
                    ) : (
                      <strong style={{ color: item.status === 'low' ? '#ef4444' : 'inherit' }}>
                        {item.quantity}
                      </strong>
                    )}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    {editingId === item.variantId ? (
                      <input
                        type="number"
                        value={editData.minThreshold ?? item.minThreshold}
                        onChange={(e) => setEditData({ ...editData, minThreshold: parseInt(e.target.value) || 0 })}
                        style={{ width: 80, padding: 4 }}
                      />
                    ) : (
                      item.minThreshold
                    )}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    {editingId === item.variantId ? (
                      <input
                        type="text"
                        value={editData.location ?? item.location ?? ''}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        placeholder="מיקום"
                        style={{ width: 120, padding: 4 }}
                      />
                    ) : (
                      item.location || '-'
                    )}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    <span className={`badge ${item.status === 'low' ? 'badge-pending' : 'badge-paid'}`}>
                      {item.status === 'low' ? 'נמוך' : 'תקין'}
                    </span>
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    {editingId === item.variantId ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn" onClick={() => handleUpdate(item.variantId)}>
                          שמור
                        </button>
                        <button className="btn" onClick={() => { setEditingId(null); setEditData({}); }}>
                          ביטול
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn" onClick={() => { setEditingId(item.variantId); setEditData({}); }}>
                          ערוך
                        </button>
                        <button className="btn" onClick={() => { setSelectedVariantId(item.variantId); setShowMovementForm(true); }}>
                          תנועה
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Movement Form Modal */}
      {showMovementForm && selectedVariantId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            padding: 24,
            borderRadius: 8,
            maxWidth: 500,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <h2 style={{ marginTop: 0 }}>הוספת תנועת מלאי</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'grid', gap: 4 }}>
                סוג תנועה
                <select
                  value={movementData.type}
                  onChange={(e) => setMovementData({ ...movementData, type: e.target.value as any })}
                >
                  <option value="IN">הכנסה</option>
                  <option value="OUT">הוצאה</option>
                  <option value="ADJUSTMENT">תיקון</option>
                  <option value="RETURN">החזרה</option>
                </select>
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                כמות
                <input
                  type="number"
                  value={movementData.quantity}
                  onChange={(e) => setMovementData({ ...movementData, quantity: parseInt(e.target.value) || 0 })}
                />
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                סיבה (אופציונלי)
                <input
                  type="text"
                  value={movementData.reason || ''}
                  onChange={(e) => setMovementData({ ...movementData, reason: e.target.value })}
                  placeholder="לדוגמה: הזמנה #123"
                />
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={handleAddMovement}>
                  שמור
                </button>
                <button className="btn" onClick={() => { setShowMovementForm(false); setSelectedVariantId(null); }}>
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movements History */}
      {selectedVariantId && movements.length > 0 && (
        <div style={{ marginTop: 24, border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>היסטוריית תנועות</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>תאריך</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>סוג</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>כמות</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>מקודם</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>חדש</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>סיבה</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(mov => (
                <tr key={mov.id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    {new Date(mov.createdAt).toLocaleString('he-IL')}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    {mov.type === 'IN' ? 'הכנסה' : mov.type === 'OUT' ? 'הוצאה' : mov.type === 'ADJUSTMENT' ? 'תיקון' : 'החזרה'}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9', color: mov.quantity > 0 ? '#10b981' : '#ef4444' }}>
                    {mov.quantity > 0 ? '+' : ''}{mov.quantity}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{mov.previousQty}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{mov.newQty}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{mov.reason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
