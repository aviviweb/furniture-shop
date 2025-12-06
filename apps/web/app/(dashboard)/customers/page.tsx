"use client";
import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../lib/api';
import { showToast } from '../../toast';
import { downloadCSV } from '../../csv';
import Link from 'next/link';

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  vatNumber?: string;
  notes?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string | null;
  createdAt: string;
  updatedAt: string;
};

type CustomerStats = {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string | null;
  favoriteProducts: string[];
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    vatNumber: '',
    notes: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      loadStats(selectedCustomer.id);
    }
  }, [selectedCustomer]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      const data = await apiGet<Customer[]>(`/customers?${params.toString()}`);
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load customers:', error);
      showToast('שגיאה בטעינת הלקוחות');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (customerId: string) => {
    try {
      const data = await apiGet<CustomerStats>(`/customers/${customerId}/stats`);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await apiPatch(`/customers/${editingId}`, formData);
        showToast('הלקוח עודכן בהצלחה');
      } else {
        await apiPost('/customers', formData);
        showToast('הלקוח נוצר בהצלחה');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        vatNumber: '',
        notes: '',
      });
      loadCustomers();
    } catch (error) {
      console.error('Failed to save customer:', error);
      showToast('שגיאה בשמירת הלקוח');
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      zipCode: customer.zipCode || '',
      vatNumber: customer.vatNumber || '',
      notes: customer.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הלקוח?')) return;
    try {
      await apiDelete(`/customers/${id}`);
      showToast('הלקוח נמחק בהצלחה');
      loadCustomers();
    } catch (error: any) {
      console.error('Failed to delete customer:', error);
      showToast(error?.message || 'שגיאה במחיקת הלקוח');
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const searchLower = search.toLowerCase();
      return (
        customer.name.toLowerCase().includes(searchLower) ||
        (customer.email || '').toLowerCase().includes(searchLower) ||
        (customer.phone || '').includes(searchLower)
      );
    });
  }, [customers, search]);

  if (loading && customers.length === 0) {
    return (
      <section className="card">
        <p>טוען...</p>
      </section>
    );
  }

  return (
    <section className="card" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 0 }}>לקוחות</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => downloadCSV('customers.csv', filteredCustomers)}>
            ייצוא CSV
          </button>
          <button
            className="btn"
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                zipCode: '',
                vatNumber: '',
                notes: '',
              });
            }}
          >
            + לקוח חדש
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        placeholder="חיפוש לפי שם, אימייל או טלפון"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Customers Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>שם</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>אימייל</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>טלפון</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>כתובת</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>הזמנות</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>סה"כ הוצא</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 16, color: 'var(--color-muted)', textAlign: 'center' }}>
                  אין תוצאות
                </td>
              </tr>
            ) : (
              filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      {customer.name}
                    </button>
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{customer.email || '-'}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{customer.phone || '-'}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    {customer.address ? (
                      <>
                        {customer.address}
                        {customer.city && `, ${customer.city}`}
                      </>
                    ) : '-'}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{customer.ordersCount}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    ₪{(customer.totalSpent || 0).toLocaleString('he-IL')}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn" onClick={() => handleEdit(customer)}>
                        ערוך
                      </button>
                      <button className="btn" onClick={() => handleDelete(customer.id)}>
                        מחק
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Form Modal */}
      {showForm && (
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
            <h2 style={{ marginTop: 0 }}>{editingId ? 'עריכת לקוח' : 'לקוח חדש'}</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'grid', gap: 4 }}>
                שם *
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                אימייל
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                טלפון
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                כתובת
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <label style={{ display: 'grid', gap: 4 }}>
                  עיר
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </label>
                <label style={{ display: 'grid', gap: 4 }}>
                  מיקוד
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </label>
              </div>
              <label style={{ display: 'grid', gap: 4 }}>
                ח.פ / עוסק
                <input
                  type="text"
                  value={formData.vatNumber}
                  onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                />
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                הערות
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={handleSubmit} disabled={!formData.name}>
                  שמור
                </button>
                <button className="btn" onClick={() => { setShowForm(false); setEditingId(null); }}>
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
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
            maxWidth: 800,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0 }}>פרטי לקוח: {selectedCustomer.name}</h2>
              <button className="btn" onClick={() => { setSelectedCustomer(null); setStats(null); }}>✕</button>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {/* Customer Info */}
              <div>
                <h3 style={{ marginTop: 0 }}>פרטי קשר</h3>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div><strong>שם:</strong> {selectedCustomer.name}</div>
                  {selectedCustomer.email && <div><strong>אימייל:</strong> {selectedCustomer.email}</div>}
                  {selectedCustomer.phone && <div><strong>טלפון:</strong> {selectedCustomer.phone}</div>}
                  {selectedCustomer.address && (
                    <div>
                      <strong>כתובת:</strong> {selectedCustomer.address}
                      {selectedCustomer.city && `, ${selectedCustomer.city}`}
                      {selectedCustomer.zipCode && ` ${selectedCustomer.zipCode}`}
                    </div>
                  )}
                  {selectedCustomer.vatNumber && <div><strong>ח.פ:</strong> {selectedCustomer.vatNumber}</div>}
                  {selectedCustomer.notes && <div><strong>הערות:</strong> {selectedCustomer.notes}</div>}
                </div>
              </div>

              {/* Stats */}
              {stats && (
                <div>
                  <h3>סטטיסטיקות</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.totalOrders}</div>
                      <div style={{ color: 'var(--color-muted)' }}>סה"כ הזמנות</div>
                    </div>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold' }}>₪{stats.totalSpent.toLocaleString('he-IL')}</div>
                      <div style={{ color: 'var(--color-muted)' }}>סה"כ הוצא</div>
                    </div>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold' }}>₪{Math.round(stats.averageOrderValue).toLocaleString('he-IL')}</div>
                      <div style={{ color: 'var(--color-muted)' }}>ממוצע הזמנה</div>
                    </div>
                  </div>
                  {stats.favoriteProducts.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <strong>מוצרים מועדפים:</strong> {stats.favoriteProducts.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => { handleEdit(selectedCustomer); setSelectedCustomer(null); }}>
                  ערוך
                </button>
                <Link href={`/orders?customer=${selectedCustomer.id}`} className="btn">
                  צפה בהזמנות
                </Link>
                <button className="btn" onClick={() => { setSelectedCustomer(null); setStats(null); }}>
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

