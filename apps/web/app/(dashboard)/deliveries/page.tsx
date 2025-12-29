"use client";
import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPatch, apiPost } from '../../../lib/api';
import { showToast } from '../../toast';
import Link from 'next/link';

type Delivery = {
  id: string;
  orderId: string;
  scheduledAt: string;
  status: 'scheduled' | 'in_transit' | 'delivered' | 'cancelled';
  driverName?: string;
  installerName?: string;
  customerName?: string;
  customerAddress?: string;
  customerPhone?: string;
  total: number;
  items: Array<{ name: string; sku: string; qty: number }>;
  hasInstallation?: boolean;
  installationId?: string;
};

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [editData, setEditData] = useState<{ status?: string; driverName?: string; installerName?: string }>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    orderId: '',
    scheduledAt: '',
    driverName: '',
    installerName: '',
    baseShippingCost: 0,
    shippingDistanceCost: 0,
    shippingFloorCost: 0,
    shippingComplexityCost: 0,
    baseAssemblyCost: 0,
    assemblyComplexityCost: 0,
  });
  const [orders, setOrders] = useState<Array<{ id: string; total: number; customerId?: string }>>([]);

  useEffect(() => {
    loadDeliveries();
    loadOrders();
  }, [filterStatus, dateFrom, dateTo]);

  const loadOrders = async () => {
    try {
      const data = await apiGet<Array<{ id: string; total: number; customerId?: string }>>('/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleCreateDelivery = async () => {
    if (!createFormData.orderId || !createFormData.scheduledAt) {
      showToast('יש למלא הזמנה ותאריך');
      return;
    }
    try {
      await apiPost('/deliveries', createFormData);
      showToast('משלוח נוצר בהצלחה');
      setShowCreateForm(false);
      setCreateFormData({
        orderId: '',
        scheduledAt: '',
        driverName: '',
        installerName: '',
        baseShippingCost: 0,
        shippingDistanceCost: 0,
        shippingFloorCost: 0,
        shippingComplexityCost: 0,
        baseAssemblyCost: 0,
        assemblyComplexityCost: 0,
      });
      loadDeliveries();
    } catch (error: any) {
      console.error('Failed to create delivery:', error);
      showToast(error?.message || 'שגיאה ביצירת המשלוח');
    }
  };

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      const data = await apiGet<Delivery[]>(`/deliveries?${params.toString()}`);
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load deliveries:', error);
      showToast('שגיאה בטעינת המשלוחים');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string) => {
    try {
      await apiPatch(`/deliveries/${id}/status`, editData);
      showToast('הסטטוס עודכן בהצלחה');
      setSelectedDelivery(null);
      setEditData({});
      loadDeliveries();
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast('שגיאה בעדכון הסטטוס');
    }
  };

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(delivery => {
      const searchLower = search.toLowerCase();
      return (
        delivery.customerName?.toLowerCase().includes(searchLower) ||
        delivery.orderId.toLowerCase().includes(searchLower) ||
        (delivery.driverName || '').toLowerCase().includes(searchLower)
      );
    });
  }, [deliveries, search]);

  const statusColors: Record<string, string> = {
    scheduled: '#3b82f6',
    in_transit: '#f59e0b',
    delivered: '#10b981',
    cancelled: '#ef4444',
  };

  const statusLabels: Record<string, string> = {
    scheduled: 'מתוכנן',
    in_transit: 'בדרך',
    delivered: 'נמסר',
    cancelled: 'בוטל',
  };

  if (loading && deliveries.length === 0) {
    return (
      <section className="card">
        <p>טוען...</p>
      </section>
    );
  }

  return (
    <section className="card" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 0 }}>משלוחים/הרכבות</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => { setShowCreateForm(true); }}>
            + צור משלוח חדש
          </button>
          <button className="btn" onClick={() => loadDeliveries()}>
            רענון
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>צור משלוח חדש</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              הזמנה
              <select
                value={createFormData.orderId}
                onChange={(e) => setCreateFormData({ ...createFormData, orderId: e.target.value })}
              >
                <option value="">בחר הזמנה</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    הזמנה #{order.id} - ₪{Number(order.total).toLocaleString('he-IL')}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              תאריך ושעה מתוכננים
              <input
                type="datetime-local"
                value={createFormData.scheduledAt}
                onChange={(e) => setCreateFormData({ ...createFormData, scheduledAt: e.target.value })}
              />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              שם נהג
              <input
                type="text"
                value={createFormData.driverName}
                onChange={(e) => setCreateFormData({ ...createFormData, driverName: e.target.value })}
              />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              שם מתקין
              <input
                type="text"
                value={createFormData.installerName}
                onChange={(e) => setCreateFormData({ ...createFormData, installerName: e.target.value })}
              />
            </label>
            <div>
              <h3 style={{ margin: '0 0 8px 0' }}>עלויות משלוח</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                <label style={{ display: 'grid', gap: 4 }}>
                  בסיס (₪)
                  <input
                    type="number"
                    step="0.01"
                    value={createFormData.baseShippingCost}
                    onChange={(e) => setCreateFormData({ ...createFormData, baseShippingCost: parseFloat(e.target.value) || 0 })}
                  />
                </label>
                <label style={{ display: 'grid', gap: 4 }}>
                  מרחק (₪)
                  <input
                    type="number"
                    step="0.01"
                    value={createFormData.shippingDistanceCost}
                    onChange={(e) => setCreateFormData({ ...createFormData, shippingDistanceCost: parseFloat(e.target.value) || 0 })}
                  />
                </label>
                <label style={{ display: 'grid', gap: 4 }}>
                  קומה (₪)
                  <input
                    type="number"
                    step="0.01"
                    value={createFormData.shippingFloorCost}
                    onChange={(e) => setCreateFormData({ ...createFormData, shippingFloorCost: parseFloat(e.target.value) || 0 })}
                  />
                </label>
                <label style={{ display: 'grid', gap: 4 }}>
                  מורכבות (₪)
                  <input
                    type="number"
                    step="0.01"
                    value={createFormData.shippingComplexityCost}
                    onChange={(e) => setCreateFormData({ ...createFormData, shippingComplexityCost: parseFloat(e.target.value) || 0 })}
                  />
                </label>
              </div>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0' }}>עלויות הרכבה</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <label style={{ display: 'grid', gap: 4 }}>
                  בסיס (₪)
                  <input
                    type="number"
                    step="0.01"
                    value={createFormData.baseAssemblyCost}
                    onChange={(e) => setCreateFormData({ ...createFormData, baseAssemblyCost: parseFloat(e.target.value) || 0 })}
                  />
                </label>
                <label style={{ display: 'grid', gap: 4 }}>
                  מורכבות (₪)
                  <input
                    type="number"
                    step="0.01"
                    value={createFormData.assemblyComplexityCost}
                    onChange={(e) => setCreateFormData({ ...createFormData, assemblyComplexityCost: parseFloat(e.target.value) || 0 })}
                  />
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={handleCreateDelivery}>
                צור משלוח
              </button>
              <button className="btn" onClick={() => { setShowCreateForm(false); }}>
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 160px 160px', gap: 8 }}>
        <input
          placeholder="חיפוש לפי לקוח, הזמנה או נהג"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">כל הסטטוסים</option>
          <option value="scheduled">מתוכנן</option>
          <option value="in_transit">בדרך</option>
          <option value="delivered">נמסר</option>
          <option value="cancelled">בוטל</option>
        </select>
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
      </div>

      {/* Deliveries List */}
      <div style={{ display: 'grid', gap: 12 }}>
        {filteredDeliveries.length === 0 ? (
          <p style={{ color: 'var(--color-muted)', textAlign: 'center', padding: 24 }}>
            אין משלוחים
          </p>
        ) : (
          filteredDeliveries.map(delivery => (
            <div
              key={delivery.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 16,
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0' }}>
                    {delivery.customerName || 'לקוח לא ידוע'}
                  </h3>
                  <p style={{ margin: '4px 0', color: 'var(--color-muted)', fontSize: 14 }}>
                    תאריך: {new Date(delivery.scheduledAt).toLocaleString('he-IL', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </p>
                  <p style={{ margin: '4px 0', color: 'var(--color-muted)', fontSize: 14 }}>
                    {delivery.customerAddress}
                  </p>
                  {delivery.customerPhone && (
                    <p style={{ margin: '4px 0', color: 'var(--color-muted)', fontSize: 14 }}>
                      טלפון: {delivery.customerPhone}
                    </p>
                  )}
                  {delivery.items && delivery.items.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <strong>פריטים:</strong>
                      <ul style={{ margin: '4px 0', paddingRight: 20 }}>
                        {delivery.items.map((item, idx) => (
                          <li key={idx} style={{ fontSize: 14 }}>
                            {item.name} (SKU: {item.sku}) x{item.qty}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 12,
                      background: statusColors[delivery.status] || '#6b7280',
                      color: '#fff',
                      fontSize: 12,
                    }}
                  >
                    {statusLabels[delivery.status] || delivery.status}
                  </span>
                  <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                    ₪{Number(delivery.total).toLocaleString('he-IL')}
                  </div>
                  <button
                    className="btn"
                    onClick={() => {
                      setSelectedDelivery(delivery);
                      setEditData({
                        status: delivery.status,
                        driverName: delivery.driverName,
                        installerName: delivery.installerName,
                      });
                    }}
                  >
                    פרטים
                  </button>
                </div>
              </div>
              {(delivery.driverName || delivery.installerName) && (
                <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 14 }}>
                  {delivery.driverName && <span>נהג: {delivery.driverName}</span>}
                  {delivery.installerName && <span>מתקין: {delivery.installerName}</span>}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Link href={`/orders/${delivery.orderId}`} style={{ fontSize: 14, color: 'var(--color-primary)' }}>
                  צפה בהזמנה
                </Link>
                {delivery.hasInstallation && delivery.installationId && (
                  <Link href={`/installer`} style={{ fontSize: 14, color: 'var(--color-primary)' }}>
                    צפה בהתקנה
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delivery Details Modal */}
      {selectedDelivery && (
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
          padding: 24,
        }}>
          <div style={{
            background: '#fff',
            padding: 24,
            borderRadius: 8,
            maxWidth: 600,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0 }}>פרטי משלוח</h2>
              <button className="btn" onClick={() => setSelectedDelivery(null)}>✕</button>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <strong>לקוח:</strong> {selectedDelivery.customerName || 'לא ידוע'}
              </div>
              <div>
                <strong>כתובת:</strong> {selectedDelivery.customerAddress || 'לא ידוע'}
              </div>
              <div>
                <strong>טלפון:</strong> {selectedDelivery.customerPhone || 'לא ידוע'}
              </div>
              <div>
                <strong>תאריך:</strong> {new Date(selectedDelivery.scheduledAt).toLocaleString('he-IL')}
              </div>
              <div>
                <strong>סה"כ:</strong> ₪{Number(selectedDelivery.total).toLocaleString('he-IL')}
              </div>

              <div>
                <label style={{ display: 'grid', gap: 4 }}>
                  סטטוס
                  <select
                    value={editData.status ?? selectedDelivery.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  >
                    <option value="scheduled">מתוכנן</option>
                    <option value="in_transit">בדרך</option>
                    <option value="delivered">נמסר</option>
                    <option value="cancelled">בוטל</option>
                  </select>
                </label>
              </div>

              <div>
                <label style={{ display: 'grid', gap: 4 }}>
                  שם נהג
                  <input
                    type="text"
                    value={editData.driverName ?? selectedDelivery.driverName ?? ''}
                    onChange={(e) => setEditData({ ...editData, driverName: e.target.value })}
                  />
                </label>
              </div>

              <div>
                <label style={{ display: 'grid', gap: 4 }}>
                  שם מתקין
                  <input
                    type="text"
                    value={editData.installerName ?? selectedDelivery.installerName ?? ''}
                    onChange={(e) => setEditData({ ...editData, installerName: e.target.value })}
                  />
                </label>
              </div>

              {selectedDelivery.items && selectedDelivery.items.length > 0 && (
                <div>
                  <strong>פריטים:</strong>
                  <ul style={{ margin: '8px 0', paddingRight: 20 }}>
                    {selectedDelivery.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} (SKU: {item.sku}) x{item.qty}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => handleStatusUpdate(selectedDelivery.id)}>
                  שמור שינויים
                </button>
                <button className="btn" onClick={() => setSelectedDelivery(null)}>
                  סגור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
