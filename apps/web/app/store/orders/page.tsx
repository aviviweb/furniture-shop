"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

type OrderItem = { productId: string; variantId: string; name?: string; sku?: string; price: number; qty: number; imageUrl?: string };
type Order = {
  id: string;
  invoiceId: string;
  date: string;
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; tax: number; total: number };
  status: string;
  customerInfo: { name: string; email: string; phone?: string; address: string; city: string; zipCode: string };
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    setOrders(stored);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'processing': return '#f59e0b';
      case 'shipped': return '#3b82f6';
      case 'delivered': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  if (orders.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Order History</h1>
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
          <p>No orders found</p>
          <Link href="/store/products" style={{ display: 'inline-block', marginTop: 16, padding: '12px 24px', background: '#0ea5e9', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Order History</h1>
      <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
        {orders.map((order) => (
          <div key={order.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>Order #{order.id}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>{formatDate(order.date)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  padding: '4px 12px', 
                  background: getStatusColor(order.status), 
                  color: '#fff', 
                  borderRadius: 20, 
                  fontSize: 12, 
                  fontWeight: 'bold',
                  marginBottom: 8
                }}>
                  {order.status.toUpperCase()}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: 18 }}>₪{order.totals.total.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#64748b' }}>Items ({order.items.length})</h4>
              <div style={{ display: 'grid', gap: 8 }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name || item.sku}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Qty: {item.qty} • ₪{item.price.toLocaleString()}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>₪{(item.price * item.qty).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#64748b' }}>Shipping Address</h4>
                <div style={{ fontSize: 14 }}>
                  <div>{order.customerInfo.name}</div>
                  <div>{order.customerInfo.address}</div>
                  <div>{order.customerInfo.city} {order.customerInfo.zipCode}</div>
                  {order.customerInfo.phone && <div>{order.customerInfo.phone}</div>}
                </div>
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#64748b' }}>Order Summary</h4>
                <div style={{ fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <span>₪{order.totals.subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping:</span>
                    <span>₪{order.totals.shipping.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tax:</span>
                    <span>₪{order.totals.tax.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: 4 }}>
                    <span>Total:</span>
                    <span>₪{order.totals.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Link 
                href={`/store/orders/${order.id}`} 
                style={{ padding: '8px 16px', background: '#0ea5e9', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14 }}
              >
                View Details
              </Link>
              <Link 
                href={`/store/invoices/${order.invoiceId}`} 
                style={{ padding: '8px 16px', background: 'transparent', color: '#0ea5e9', border: '1px solid #0ea5e9', borderRadius: 6, textDecoration: 'none', fontSize: 14 }}
              >
                View Invoice
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
