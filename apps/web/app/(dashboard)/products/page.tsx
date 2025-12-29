"use client";
import { downloadCSV, uploadCSV } from '../../csv';
import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost, apiPatch } from '../../../lib/api';
import { showToast } from '../../toast';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type Variant = {
  id?: string;
  sku: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  vatRate?: number;
};

type Product = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  stock?: number;
  variants?: Variant[];
};

const demo: Product[] = [
  { id: 'PRD-001', name: 'ספה 3 מושבים', price: 2490, stock: 5 },
  { id: 'PRD-002', name: 'כורסה', price: 990, stock: 12 },
  { id: 'PRD-003', name: 'שולחן סלון', price: 790, stock: 7 },
];

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [q, setQ] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    variants: [{ sku: '', price: 0, stock: 0, imageUrl: '', vatRate: undefined }] as Variant[],
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const r = await apiGet<Product[]>('/products');
      if (Array.isArray(r)) setData(r);
    } catch (error) {
      console.error('Failed to load products:', error);
      showToast('שגיאה בטעינת המוצרים');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await apiPatch(`/products/${editingId}`, {
          name: formData.name,
          description: formData.description,
          imageUrl: formData.imageUrl,
        });
        showToast('מוצר עודכן בהצלחה');
      } else {
        await apiPost('/products', {
          name: formData.name,
          description: formData.description,
          imageUrl: formData.imageUrl,
          variants: formData.variants.filter(v => v.sku && v.price > 0),
        });
        showToast('מוצר נוצר בהצלחה');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        variants: [{ sku: '', price: 0, stock: 0, imageUrl: '', vatRate: undefined }],
      });
      loadProducts();
    } catch (error: any) {
      console.error('Failed to save product:', error);
      showToast(error?.message || 'שגיאה בשמירת המוצר');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      variants: product.variants && product.variants.length > 0
        ? product.variants.map(v => ({
            id: v.id,
            sku: v.sku || '',
            price: v.price || 0,
            stock: v.stock || 0,
            imageUrl: (v as any).imageUrl || '',
            vatRate: (v as any).vatRate,
          }))
        : [{ sku: '', price: 0, stock: 0, imageUrl: '', vatRate: undefined }],
    });
    setShowForm(true);
  };

  const [priceMax, setPriceMax] = useState('');
  const [arch, setArch] = useState('');
  const filtered = useMemo(()=> data.filter(p => {
    const text = (p?.name || '').includes(q) || ((p?.id || '').includes(q));
    const price = p.price ?? p.variants?.[0]?.price ?? 0;
    const pm = Number(priceMax);
    const priceOk = !priceMax || price <= pm;
    const a = (p as any).archived === true;
    const archOk = arch === '' || (arch === 'archived' ? a : !a);
    return text && priceOk && archOk;
  }), [data, q, priceMax, arch]);

  if (typeof window !== 'undefined') {
    localStorage.setItem('demo-products', JSON.stringify(data));
    localStorage.setItem('q-products', q);
  }

  return (
    <section className="card" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h1 className="text-3xl" style={{ marginTop: 0, marginBottom: 8 }}>מוצרים</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', description: '', imageUrl: '', variants: [{ sku: '', price: 0, stock: 0, imageUrl: '', vatRate: undefined }] }); }}>
            + מוצר חדש
          </button>
          <button className="btn" onClick={() => downloadCSV('products.csv', filtered)}>ייצוא CSV</button>
          <Link href="/products/attributes" className="btn">ניהול Attributes</Link>
        </div>
      </div>
      <input placeholder="חיפוש לפי שם/מק״ט" value={q} onChange={(e)=> setQ(e.target.value)} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 180px 160px', gap:8 }}>
        <input placeholder="סינון לפי מחיר עד..." value={priceMax} onChange={(e)=> setPriceMax(e.target.value)} />
        <select value={arch} onChange={(e)=> setArch(e.target.value)}>
          <option value="">פעילים + ארכיון</option>
          <option value="active">רק פעילים</option>
          <option value="archived">רק ארכיון</option>
        </select>
      </div>
      {showForm && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>{editingId ? 'ערוך מוצר' : 'מוצר חדש'}</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              שם המוצר
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="למשל: ספה 3 מושבים"
              />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              תיאור
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="תיאור המוצר"
                rows={3}
              />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              תמונת מוצר (URL)
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </label>
            <div>
              <h3 style={{ margin: '0 0 8px 0' }}>וריאנטים</h3>
              {formData.variants.map((variant, idx) => (
                <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 8 }}>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[idx].sku = e.target.value;
                        setFormData({ ...formData, variants: newVariants });
                      }}
                      placeholder="SKU"
                    />
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[idx].price = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, variants: newVariants });
                      }}
                      placeholder="מחיר"
                    />
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[idx].stock = parseInt(e.target.value) || 0;
                        setFormData({ ...formData, variants: newVariants });
                      }}
                      placeholder="מלאי"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={variant.vatRate || ''}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[idx].vatRate = e.target.value ? parseFloat(e.target.value) : undefined;
                        setFormData({ ...formData, variants: newVariants });
                      }}
                      placeholder="מע״מ (0.17)"
                    />
                    <input
                      type="url"
                      value={variant.imageUrl || ''}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[idx].imageUrl = e.target.value;
                        setFormData({ ...formData, variants: newVariants });
                      }}
                      placeholder="תמונה (URL)"
                    />
                  </div>
                </div>
              ))}
              <button
                className="btn"
                onClick={() => setFormData({ ...formData, variants: [...formData.variants, { sku: '', price: 0, stock: 0, imageUrl: '', vatRate: undefined }] })}
              >
                + הוסף וריאנט
              </button>
            </div>
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

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>תמונה</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>שם</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>מחיר</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>מלאי</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 16, color: 'var(--color-muted)' }}>אין תוצאות תואמות לחיפוש.</td>
              </tr>
            )}
            {filtered.map((row) => {
              const price = row.price ?? row.variants?.[0]?.price ?? 0;
              const stock = row.stock ?? row.variants?.[0]?.stock ?? '-';
              return (
                <tr key={row.id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    {row.imageUrl && (
                      <img src={row.imageUrl} alt={row.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                    )}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{row.name}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>₪{(price || 0).toLocaleString('he-IL')}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{stock}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                    <button className="btn" onClick={() => handleEdit(row)}>
                      ערוך
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}


