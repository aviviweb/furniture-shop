"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '../../../lib/api';
import { showToast } from '../../toast';
import { PaymentMethodSelector } from '../../payment-demo';

type CartItem = { productId: string; variantId: string; name?: string; sku?: string; price: number; qty: number; imageUrl?: string };

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'bank'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  const calculateShipping = () => {
    const baseRate = 50;
    const weightRate = cart.length * 10;
    const distanceRate = shippingMethod === 'express' ? 30 : 0;
    return baseRate + weightRate + distanceRate;
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = calculateShipping();
    const tax = subtotal * 0.17; // 17% VAT
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('העגלה שלך ריקה');
      return;
    }

    setIsProcessing(true);
    try {
      const totals = calculateTotal();
      
      // Create order
      const orderData = {
        customerInfo,
        items: cart.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.qty,
          price: item.price
        })),
        shippingMethod,
        paymentMethod,
        totals
      };

      const order = await apiPost<any>('/orders', orderData);
      
      // Create invoice
      const invoice = await apiPost<any>('/invoices', {
        orderId: (order as any).id,
        customerInfo,
        items: cart.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.qty,
          price: item.price,
          description: item.name || item.sku
        })),
        subtotal: totals.subtotal,
        tax: totals.tax,
        shipping: totals.shipping,
        total: totals.total
      });

      // Clear cart
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('storage'));

      showToast('ההזמנה נוצרה בהצלחה!');
      
      // Store order in history
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.unshift({
        id: order.id,
        invoiceId: invoice.id,
        date: new Date().toISOString(),
        items: cart,
        totals,
        status: 'confirmed',
        customerInfo
      });
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

      router.push(`/store/orders/${order.id}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      showToast('שגיאה בתהליך התשלום. נסה שוב.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totals = calculateTotal();

  if (cart.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <h1>תשלום</h1>
        <p>העגלה שלך ריקה. <a href="/store/products">המשך לקנות</a></p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>תשלום</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
        {/* Customer Information */}
        <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h2 style={{ margin: '0 0 16px 0' }}>פרטי לקוח</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input
              type="text"
              placeholder="שם מלא"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              required
              style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
            />
            <input
              type="email"
              placeholder="אימייל"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              required
              style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
            />
            <input
              type="tel"
              placeholder="טלפון"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
            />
            <input
              type="text"
              placeholder="כתובת"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              required
              style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
            />
            <input
              type="text"
              placeholder="עיר"
              value={customerInfo.city}
              onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
              required
              style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
            />
            <input
              type="text"
              placeholder="מיקוד"
              value={customerInfo.zipCode}
              onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
              required
              style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
            />
          </div>
        </section>

        {/* Shipping Method */}
        <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h2 style={{ margin: '0 0 16px 0' }}>שיטת משלוח</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={shippingMethod === 'standard'}
                onChange={(e) => setShippingMethod(e.target.value)}
              />
              <span>משלוח סטנדרטי (3-5 ימים) - ₪{calculateShipping()} </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={shippingMethod === 'express'}
                onChange={(e) => setShippingMethod(e.target.value)}
              />
              <span>משלוח מהיר (1-2 ימים) - ₪{calculateShipping()} </span>
            </label>
          </div>
        </section>

        {/* Payment Method */}
        <PaymentMethodSelector 
          selectedMethod={paymentMethod}
          onMethodChange={setPaymentMethod}
          amount={totals.total}
          onSuccess={() => {
            showToast('Payment successful! Order placed.');
            // Continue with order creation...
          }}
        />

        {/* Order Summary */}
        <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h2 style={{ margin: '0 0 16px 0' }}>סיכום הזמנה</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{item.name || item.sku} x {item.qty}</span>
                <span>₪{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>סה"כ ביניים:</span>
                <span>₪{totals.subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>משלוח:</span>
                <span>₪{totals.shipping.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>מע"מ (17%):</span>
                <span>₪{totals.tax.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18, marginTop: 8 }}>
                <span>סה"כ:</span>
                <span>₪{totals.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={isProcessing}
          style={{
            padding: '16px 32px',
            background: isProcessing ? '#94a3b8' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontSize: 18,
            fontWeight: 'bold'
          }}
        >
          {isProcessing ? 'מעבד...' : `השלם הזמנה - ₪${totals.total.toLocaleString()}`}
        </button>
      </form>
    </main>
  );
}