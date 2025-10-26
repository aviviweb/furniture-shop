"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const found = orderHistory.find((o: Order) => o.id === orderId);
    setOrder(found || null);
  }, [orderId]);

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

  if (!order) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Order Not Found</h1>
        <p>This order could not be found.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 8px 0' }}>Order #{order.id}</h1>
        <p style={{ margin: 0, color: '#64748b' }}>Placed on {formatDate(order.date)}</p>
      </div>

      <div style={{ display: 'grid', gap: 24 }}>
        {/* Order Status */}
        <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h2 style={{ margin: '0 0 16px 0' }}>Order Status</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              padding: '8px 16px', 
              background: getStatusColor(order.status), 
              color: '#fff', 
              borderRadius: 20, 
              fontSize: 14, 
              fontWeight: 'bold'
            }}>
              {order.status.toUpperCase()}
            </div>
            <span style={{ color: '#64748b', fontSize: 14 }}>
              {order.status === 'confirmed' && 'Your order has been confirmed and is being prepared.'}
              {order.status === 'processing' && 'Your order is being processed.'}
              {order.status === 'shipped' && 'Your order has been shipped.'}
              {order.status === 'delivered' && 'Your order has been delivered.'}
              {order.status === 'cancelled' && 'This order has been cancelled.'}
            </span>
          </div>
        </section>

        {/* Order Items */}
        <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h2 style={{ margin: '0 0 16px 0' }}>Order Items</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 12, background: '#f8fafc', borderRadius: 6 }}>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 16 }}>{item.name || item.sku}</h3>
                  <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: 14 }}>SKU: {item.sku}</p>
                  <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
                    <span>Quantity: {item.qty}</span>
                    <span>Price: ₪{item.price.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 'bold' }}>₪{(item.price * item.qty).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Information */}
        <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h2 style={{ margin: '0 0 16px 0' }}>Customer Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#64748b' }}>Contact Details</h3>
              <div style={{ fontSize: 14 }}>
                <div>{order.customerInfo.name}</div>
                <div>{order.customerInfo.email}</div>
                {order.customerInfo.phone && <div>{order.customerInfo.phone}</div>}
              </div>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#64748b' }}>Shipping Address</h3>
              <div style={{ fontSize: 14 }}>
                <div>{order.customerInfo.address}</div>
                <div>{order.customerInfo.city} {order.customerInfo.zipCode}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h2 style={{ margin: '0 0 16px 0' }}>Order Summary</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span>₪{order.totals.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping:</span>
              <span>₪{order.totals.shipping.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax (17%):</span>
              <span>₪{order.totals.tax.toLocaleString()}</span>
            </div>
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}>
                <span>Total:</span>
                <span>₪{order.totals.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <a 
            href={`/store/invoices/${order.invoiceId}`} 
            style={{ padding: '12px 24px', background: '#0ea5e9', color: '#fff', borderRadius: 8, textDecoration: 'none' }}
          >
            View Invoice
          </a>
          <a 
            href="/store/orders" 
            style={{ padding: '12px 24px', background: 'transparent', color: '#0ea5e9', border: '1px solid #0ea5e9', borderRadius: 8, textDecoration: 'none' }}
          >
            Back to Orders
          </a>
        </div>
      </div>
    </main>
  );
}
