"use client";
import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPatch, apiPost } from '../../../lib/api';
import { showToast } from '../../toast';
import Link from 'next/link';

type Installation = {
  id: string;
  deliveryId: string;
  orderId: string;
  scheduledAt: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  installerName?: string;
  installerPhone?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  notes?: string;
  completedAt?: string;
  images?: Array<{ id: string; url: string; type: 'before' | 'after' | 'other'; description?: string }>;
};

type CalendarDay = {
  date: Date;
  installations: Array<{
    id: string;
    scheduledAt: Date;
    customerName?: string;
    status: string;
  }>;
};

export default function InstallerPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [editData, setEditData] = useState<{ status?: string; notes?: string; installerName?: string; installerPhone?: string }>({});
  const [imageData, setImageData] = useState<{ url: string; type: 'before' | 'after' | 'other'; description?: string }>({ url: '', type: 'before' });

  useEffect(() => {
    if (view === 'list') {
      loadInstallations();
    } else {
      loadCalendar();
    }
  }, [view, filterStatus, currentMonth, currentYear]);

  const loadInstallations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      const data = await apiGet<Installation[]>(`/installer?${params.toString()}`);
      setInstallations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load installations:', error);
      showToast('שגיאה בטעינת ההתקנות');
    } finally {
      setLoading(false);
    }
  };

  const loadCalendar = async () => {
    try {
      setLoading(true);
      const data = await apiGet<CalendarDay[]>(`/installer/calendar?month=${currentMonth}&year=${currentYear}`);
      setCalendar(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load calendar:', error);
      showToast('שגיאה בטעינת לוח הזמנים');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string) => {
    try {
      await apiPatch(`/installer/${id}/status`, editData);
      showToast('הסטטוס עודכן בהצלחה');
      setSelectedInstallation(null);
      setEditData({});
      loadInstallations();
      if (view === 'calendar') loadCalendar();
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast('שגיאה בעדכון הסטטוס');
    }
  };

  const handleAddImage = async (id: string) => {
    if (!imageData.url) {
      showToast('נא להזין URL תמונה');
      return;
    }
    try {
      await apiPost(`/installer/${id}/images`, imageData);
      showToast('תמונה נוספה בהצלחה');
      setImageData({ url: '', type: 'before' });
      if (selectedInstallation) {
        const updated = await apiGet<Installation>(`/installer/${id}`);
        setSelectedInstallation(updated);
      }
      loadInstallations();
    } catch (error) {
      console.error('Failed to add image:', error);
      showToast('שגיאה בהוספת תמונה');
    }
  };

  const statusColors: Record<string, string> = {
    scheduled: '#3b82f6',
    in_progress: '#f59e0b',
    completed: '#10b981',
    cancelled: '#ef4444',
  };

  const statusLabels: Record<string, string> = {
    scheduled: 'מתוכנן',
    in_progress: 'בביצוע',
    completed: 'הושלם',
    cancelled: 'בוטל',
  };

  const getDayOfWeek = (date: Date) => {
    const days = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
    return days[date.getDay()];
  };

  if (loading && installations.length === 0 && calendar.length === 0) {
    return (
      <section className="card">
        <p>טוען...</p>
      </section>
    );
  }

  return (
    <section className="card" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 0 }}>אזור מתקין</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`btn ${view === 'list' ? '' : 'btn-secondary'}`}
            onClick={() => setView('list')}
          >
            רשימה
          </button>
          <button
            className={`btn ${view === 'calendar' ? '' : 'btn-secondary'}`}
            onClick={() => setView('calendar')}
          >
            לוח זמנים
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <>
          {/* Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 8 }}>
            <input
              placeholder="חיפוש..."
              onChange={(e) => {
                // Simple search - can be enhanced
              }}
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">כל הסטטוסים</option>
              <option value="scheduled">מתוכנן</option>
              <option value="in_progress">בביצוע</option>
              <option value="completed">הושלם</option>
              <option value="cancelled">בוטל</option>
            </select>
          </div>

          {/* Installations List */}
          <div style={{ display: 'grid', gap: 12 }}>
            {installations.length === 0 ? (
              <p style={{ color: 'var(--color-muted)', textAlign: 'center', padding: 24 }}>
                אין התקנות
              </p>
            ) : (
              installations.map(inst => (
                <div
                  key={inst.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: 16,
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0' }}>{inst.customerName || 'לקוח לא ידוע'}</h3>
                      <p style={{ margin: '4px 0', color: 'var(--color-muted)', fontSize: 14 }}>
                        {new Date(inst.scheduledAt).toLocaleString('he-IL', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </p>
                      <p style={{ margin: '4px 0', color: 'var(--color-muted)', fontSize: 14 }}>
                        {inst.customerAddress}
                      </p>
                      {inst.customerPhone && (
                        <p style={{ margin: '4px 0', color: 'var(--color-muted)', fontSize: 14 }}>
                          טלפון: {inst.customerPhone}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: 12,
                          background: statusColors[inst.status] || '#6b7280',
                          color: '#fff',
                          fontSize: 12,
                        }}
                      >
                        {statusLabels[inst.status] || inst.status}
                      </span>
                      <button
                        className="btn"
                        onClick={() => {
                          setSelectedInstallation(inst);
                          setEditData({ status: inst.status, notes: inst.notes, installerName: inst.installerName, installerPhone: inst.installerPhone });
                        }}
                      >
                        פרטים
                      </button>
                    </div>
                  </div>
                  {inst.installerName && (
                    <p style={{ margin: '4px 0', fontSize: 14 }}>
                      מתקין: {inst.installerName} {inst.installerPhone && `(${inst.installerPhone})`}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Link href={`/orders/${inst.orderId}`} style={{ fontSize: 14, color: 'var(--color-primary)' }}>
                      צפה בהזמנה
                    </Link>
                    <Link href={`/deliveries`} style={{ fontSize: 14, color: 'var(--color-primary)' }}>
                      צפה במשלוח
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* Calendar Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <button
              className="btn"
              onClick={() => {
                if (currentMonth === 1) {
                  setCurrentMonth(12);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
            >
              ← חודש קודם
            </button>
            <h2 style={{ margin: 0 }}>
              {new Date(currentYear, currentMonth - 1).toLocaleString('he-IL', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              className="btn"
              onClick={() => {
                if (currentMonth === 12) {
                  setCurrentMonth(1);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
            >
              חודש הבא →
            </button>
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(day => (
              <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', padding: 8 }}>
                {day}
              </div>
            ))}
            {calendar.map((day, idx) => {
              const dayNum = day.date.getDate();
              const isToday = day.date.toDateString() === new Date().toDateString();
              return (
                <div
                  key={idx}
                  style={{
                    minHeight: 100,
                    border: '1px solid #e5e7eb',
                    borderRadius: 4,
                    padding: 8,
                    background: isToday ? '#f0f9ff' : '#fff',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{dayNum}</div>
                  <div style={{ display: 'grid', gap: 4 }}>
                    {day.installations.map(inst => (
                      <div
                        key={inst.id}
                        style={{
                          padding: 4,
                          borderRadius: 4,
                          background: statusColors[inst.status] || '#6b7280',
                          color: '#fff',
                          fontSize: 11,
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          const fullInst = installations.find(i => i.id === inst.id);
                          if (fullInst) {
                            setSelectedInstallation(fullInst);
                            setEditData({ status: fullInst.status, notes: fullInst.notes });
                          }
                        }}
                      >
                        {new Date(inst.scheduledAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })} - {inst.customerName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Installation Details Modal */}
      {selectedInstallation && (
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
              <h2 style={{ margin: 0 }}>פרטי התקנה</h2>
              <button className="btn" onClick={() => setSelectedInstallation(null)}>✕</button>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <strong>לקוח:</strong> {selectedInstallation.customerName || 'לא ידוע'}
              </div>
              <div>
                <strong>כתובת:</strong> {selectedInstallation.customerAddress || 'לא ידוע'}
              </div>
              <div>
                <strong>טלפון:</strong> {selectedInstallation.customerPhone || 'לא ידוע'}
              </div>
              <div>
                <strong>תאריך:</strong> {new Date(selectedInstallation.scheduledAt).toLocaleString('he-IL')}
              </div>

              <div>
                <label style={{ display: 'grid', gap: 4 }}>
                  סטטוס
                  <select
                    value={editData.status ?? selectedInstallation.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  >
                    <option value="scheduled">מתוכנן</option>
                    <option value="in_progress">בביצוע</option>
                    <option value="completed">הושלם</option>
                    <option value="cancelled">בוטל</option>
                  </select>
                </label>
              </div>

              <div>
                <label style={{ display: 'grid', gap: 4 }}>
                  שם מתקין
                  <input
                    type="text"
                    value={editData.installerName ?? selectedInstallation.installerName ?? ''}
                    onChange={(e) => setEditData({ ...editData, installerName: e.target.value })}
                  />
                </label>
              </div>

              <div>
                <label style={{ display: 'grid', gap: 4 }}>
                  טלפון מתקין
                  <input
                    type="text"
                    value={editData.installerPhone ?? selectedInstallation.installerPhone ?? ''}
                    onChange={(e) => setEditData({ ...editData, installerPhone: e.target.value })}
                  />
                </label>
              </div>

              <div>
                <label style={{ display: 'grid', gap: 4 }}>
                  הערות
                  <textarea
                    value={editData.notes ?? selectedInstallation.notes ?? ''}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    rows={4}
                  />
                </label>
              </div>

              <div>
                <h3>תמונות</h3>
                {selectedInstallation.images && selectedInstallation.images.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginBottom: 16 }}>
                    {selectedInstallation.images.map(img => (
                      <div key={img.id} style={{ position: 'relative' }}>
                        <img src={img.url} alt={img.description || img.type} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 4 }} />
                        <div style={{ fontSize: 11, marginTop: 4 }}>
                          {img.type === 'before' ? 'לפני' : img.type === 'after' ? 'אחרי' : 'אחר'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-muted)' }}>אין תמונות</p>
                )}

                <div style={{ border: '1px solid #e5e7eb', borderRadius: 4, padding: 12, marginTop: 12 }}>
                  <h4 style={{ marginTop: 0 }}>הוספת תמונה</h4>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <label style={{ display: 'grid', gap: 4 }}>
                      URL תמונה
                      <input
                        type="text"
                        value={imageData.url}
                        onChange={(e) => setImageData({ ...imageData, url: e.target.value })}
                        placeholder="https://..."
                      />
                    </label>
                    <label style={{ display: 'grid', gap: 4 }}>
                      סוג
                      <select
                        value={imageData.type}
                        onChange={(e) => setImageData({ ...imageData, type: e.target.value as any })}
                      >
                        <option value="before">לפני</option>
                        <option value="after">אחרי</option>
                        <option value="other">אחר</option>
                      </select>
                    </label>
                    <label style={{ display: 'grid', gap: 4 }}>
                      תיאור (אופציונלי)
                      <input
                        type="text"
                        value={imageData.description || ''}
                        onChange={(e) => setImageData({ ...imageData, description: e.target.value })}
                      />
                    </label>
                    <button className="btn" onClick={() => handleAddImage(selectedInstallation.id)}>
                      הוסף תמונה
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => handleStatusUpdate(selectedInstallation.id)}>
                  שמור שינויים
                </button>
                <button className="btn" onClick={() => setSelectedInstallation(null)}>
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
