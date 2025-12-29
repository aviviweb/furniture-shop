"use client";
import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../../lib/api';
import { showToast } from '../../../toast';

type AttributeValue = {
  id: string;
  value: string;
  displayOrder: number;
};

type Attribute = {
  id: string;
  name: string;
  type: 'PREDEFINED' | 'DYNAMIC';
  isRequired: boolean;
  displayOrder: number;
  values?: AttributeValue[];
};

export default function AttributesPage() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'PREDEFINED' as 'PREDEFINED' | 'DYNAMIC',
    isRequired: false,
    displayOrder: 0,
  });
  const [valueFormData, setValueFormData] = useState({
    value: '',
    displayOrder: 0,
  });

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      setLoading(true);
      const data = await apiGet<Attribute[]>('/products/attributes');
      setAttributes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load attributes:', error);
      showToast('שגיאה בטעינת ה-attributes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await apiPatch(`/products/attributes/${editingId}`, formData);
        showToast('Attribute עודכן בהצלחה');
      } else {
        await apiPost('/products/attributes', formData);
        showToast('Attribute נוצר בהצלחה');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', type: 'PREDEFINED', isRequired: false, displayOrder: 0 });
      loadAttributes();
    } catch (error: any) {
      console.error('Failed to save attribute:', error);
      showToast(error?.message || 'שגיאה בשמירת ה-attribute');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את ה-attribute הזה?')) return;
    try {
      await apiDelete(`/products/attributes/${id}`);
      showToast('Attribute נמחק בהצלחה');
      loadAttributes();
    } catch (error: any) {
      console.error('Failed to delete attribute:', error);
      showToast(error?.message || 'שגיאה במחיקת ה-attribute');
    }
  };

  const handleEdit = (attr: Attribute) => {
    setEditingId(attr.id);
    setFormData({
      name: attr.name,
      type: attr.type,
      isRequired: attr.isRequired,
      displayOrder: attr.displayOrder,
    });
    setShowForm(true);
  };

  const handleAddValue = async (attributeId: string) => {
    if (!valueFormData.value.trim()) {
      showToast('יש להזין ערך');
      return;
    }
    try {
      await apiPost(`/products/attributes/${attributeId}/values`, valueFormData);
      showToast('ערך נוסף בהצלחה');
      setValueFormData({ value: '', displayOrder: 0 });
      loadAttributes();
    } catch (error: any) {
      console.error('Failed to add value:', error);
      showToast(error?.message || 'שגיאה בהוספת הערך');
    }
  };

  const handleDeleteValue = async (attributeId: string, valueId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הערך הזה?')) return;
    try {
      await apiDelete(`/products/attributes/${attributeId}/values/${valueId}`);
      showToast('ערך נמחק בהצלחה');
      loadAttributes();
    } catch (error: any) {
      console.error('Failed to delete value:', error);
      showToast(error?.message || 'שגיאה במחיקת הערך');
    }
  };

  if (loading && attributes.length === 0) {
    return (
      <section className="card">
        <p>טוען...</p>
      </section>
    );
  }

  return (
    <section className="card" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 0 }}>ניהול Attributes</h1>
        <button className="btn" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', type: 'PREDEFINED', isRequired: false, displayOrder: 0 }); }}>
          + הוסף Attribute
        </button>
      </div>

      {showForm && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>{editingId ? 'ערוך Attribute' : 'הוסף Attribute חדש'}</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              שם
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="למשל: צבע, גודל, חומר"
              />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              סוג
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'PREDEFINED' | 'DYNAMIC' })}
              >
                <option value="PREDEFINED">קבוע מראש (עם ערכים מוגדרים)</option>
                <option value="DYNAMIC">דינמי (ערך חופשי)</option>
              </select>
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={formData.isRequired}
                onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
              />
              חובה למלא
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              סדר הצגה
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              />
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={handleSubmit}>
                שמור
              </button>
              <button className="btn" onClick={() => { setShowForm(false); setEditingId(null); }}>
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {attributes.map((attr) => (
          <div key={attr.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>{attr.name}</h3>
                <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: 14 }}>
                  סוג: {attr.type === 'PREDEFINED' ? 'קבוע מראש' : 'דינמי'} | 
                  {attr.isRequired ? ' חובה' : ' אופציונלי'} | 
                  סדר: {attr.displayOrder}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => handleEdit(attr)}>
                  ערוך
                </button>
                <button className="btn" onClick={() => handleDelete(attr.id)}>
                  מחק
                </button>
              </div>
            </div>

            {attr.type === 'PREDEFINED' && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ margin: '0 0 8px 0' }}>ערכים אפשריים:</h4>
                <div style={{ display: 'grid', gap: 8 }}>
                  {attr.values?.map((val) => (
                    <div key={val.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, background: '#f9fafb', borderRadius: 4 }}>
                      <span>{val.value} (סדר: {val.displayOrder})</span>
                      <button className="btn" onClick={() => handleDeleteValue(attr.id, val.id)}>
                        מחק
                      </button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <input
                      type="text"
                      value={valueFormData.value}
                      onChange={(e) => setValueFormData({ ...valueFormData, value: e.target.value })}
                      placeholder="הוסף ערך חדש"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="number"
                      value={valueFormData.displayOrder}
                      onChange={(e) => setValueFormData({ ...valueFormData, displayOrder: parseInt(e.target.value) || 0 })}
                      placeholder="סדר"
                      style={{ width: 80 }}
                    />
                    <button className="btn" onClick={() => handleAddValue(attr.id)}>
                      הוסף
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

