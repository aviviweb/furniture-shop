"use client";
import { useEffect, useState } from 'react';
import { apiGet, apiPatch } from '../../../lib/api';
import { showToast } from '../../toast';
import Link from 'next/link';

type Settings = {
  id: string;
  companyId: string;
  defaultVatRate: number;
  baseShippingCost: number;
  shippingCostPerKm: number;
  shippingCostPerFloor: number;
  baseAssemblyCost: number;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    defaultVatRate: 0.17,
    baseShippingCost: 50,
    shippingCostPerKm: 2,
    shippingCostPerFloor: 10,
    baseAssemblyCost: 100,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await apiGet<Settings>('/companies/settings');
      setSettings(data);
      setFormData({
        defaultVatRate: data.defaultVatRate || 0.17,
        baseShippingCost: data.baseShippingCost || 50,
        shippingCostPerKm: data.shippingCostPerKm || 2,
        shippingCostPerFloor: data.shippingCostPerFloor || 10,
        baseAssemblyCost: data.baseAssemblyCost || 100,
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
      showToast('שגיאה בטעינת ההגדרות');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await apiPatch('/companies/settings', formData);
      showToast('הגדרות נשמרו בהצלחה');
      loadSettings();
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      showToast(error?.message || 'שגיאה בשמירת ההגדרות');
    }
  };

  if (loading && !settings) {
    return (
      <section className="card">
        <p>טוען...</p>
      </section>
    );
  }

  return (
    <section className="card" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 0 }}>הגדרות</h1>
        <Link href="/settings/branding" className="btn">
          מיתוג
        </Link>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff' }}>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>הגדרות כלליות</h2>
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <h3 style={{ margin: '0 0 12px 0' }}>מע"מ</h3>
            <label style={{ display: 'grid', gap: 4 }}>
              מע"מ ברירת מחדל (%)
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.defaultVatRate}
                onChange={(e) => setFormData({ ...formData, defaultVatRate: parseFloat(e.target.value) || 0 })}
              />
              <small style={{ color: 'var(--color-muted)' }}>
                מע"מ ברירת מחדל לכל המוצרים (ניתן לשנות לכל מוצר בנפרד)
              </small>
            </label>
          </div>

          <div>
            <h3 style={{ margin: '0 0 12px 0' }}>עלויות משלוח</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'grid', gap: 4 }}>
                מחיר בסיס (₪)
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.baseShippingCost}
                  onChange={(e) => setFormData({ ...formData, baseShippingCost: parseFloat(e.target.value) || 0 })}
                />
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                תוספת לכל ק"מ (₪)
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.shippingCostPerKm}
                  onChange={(e) => setFormData({ ...formData, shippingCostPerKm: parseFloat(e.target.value) || 0 })}
                />
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                תוספת לכל קומה (₪)
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.shippingCostPerFloor}
                  onChange={(e) => setFormData({ ...formData, shippingCostPerFloor: parseFloat(e.target.value) || 0 })}
                />
              </label>
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 12px 0' }}>עלויות הרכבה</h3>
            <label style={{ display: 'grid', gap: 4 }}>
              מחיר בסיס (₪)
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.baseAssemblyCost}
                onChange={(e) => setFormData({ ...formData, baseAssemblyCost: parseFloat(e.target.value) || 0 })}
              />
              <small style={{ color: 'var(--color-muted)' }}>
                ניתן להוסיף תוספת מורכבות בעת יצירת הזמנה/משלוח
              </small>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={handleSubmit}>
              שמור הגדרות
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

