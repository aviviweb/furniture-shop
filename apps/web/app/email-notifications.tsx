"use client";
import { useState } from 'react';
import { showToast } from '../../toast';

type NotificationType = 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'payment_received' | 'review_request';

export function EmailNotificationDemo() {
  const [email, setEmail] = useState('');
  const [notificationType, setNotificationType] = useState<NotificationType>('order_confirmed');
  const [isSending, setIsSending] = useState(false);

  const notificationTemplates = {
    order_confirmed: {
      subject: 'Order Confirmed - Thank You!',
      preview: 'Your order has been confirmed and is being prepared for shipment.'
    },
    order_shipped: {
      subject: 'Your Order Has Shipped!',
      preview: 'Great news! Your order is on its way to you.'
    },
    order_delivered: {
      subject: 'Order Delivered Successfully',
      preview: 'Your order has been delivered. We hope you love it!'
    },
    payment_received: {
      subject: 'Payment Received - Thank You!',
      preview: 'We have received your payment. Your order is being processed.'
    },
    review_request: {
      subject: 'How was your experience?',
      preview: 'We would love to hear about your experience with our products.'
    }
  };

  const sendNotification = async () => {
    if (!email) {
      showToast('Please enter an email address');
      return;
    }

    setIsSending(true);
    
    // Simulate email sending
    setTimeout(() => {
      setIsSending(false);
      const template = notificationTemplates[notificationType];
      showToast(`Email sent to ${email}: "${template.subject}"`);
    }, 1500);
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
      <h3 style={{ margin: '0 0 16px 0' }}>📧 Email Notification Demo</h3>
      <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: 14 }}>
        Send demo email notifications to test the system
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="customer@example.com"
          style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Notification Type</label>
        <select
          value={notificationType}
          onChange={(e) => setNotificationType(e.target.value as NotificationType)}
          style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
        >
          <option value="order_confirmed">Order Confirmed</option>
          <option value="order_shipped">Order Shipped</option>
          <option value="order_delivered">Order Delivered</option>
          <option value="payment_received">Payment Received</option>
          <option value="review_request">Review Request</option>
        </select>
      </div>

      <div style={{ marginBottom: 16, padding: 12, background: '#f8fafc', borderRadius: 6 }}>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>
          {notificationTemplates[notificationType].subject}
        </div>
        <div style={{ fontSize: 14, color: '#64748b' }}>
          {notificationTemplates[notificationType].preview}
        </div>
      </div>

      <button
        onClick={sendNotification}
        disabled={isSending}
        style={{
          width: '100%',
          padding: '12px 24px',
          background: isSending ? '#94a3b8' : '#10b981',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: isSending ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        {isSending ? 'Sending...' : 'Send Demo Email'}
      </button>
    </div>
  );
}

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    marketingEmails: false,
    reviewReminders: true,
    paymentConfirmations: true,
    shippingUpdates: true
  });

  const updateSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    showToast('Notification settings updated');
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
      <h3 style={{ margin: '0 0 16px 0' }}>🔔 Notification Preferences</h3>
      
      <div style={{ display: 'grid', gap: 12 }}>
        {Object.entries(settings).map(([key, value]) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={value}
              onChange={() => updateSetting(key as keyof typeof settings)}
            />
            <span style={{ textTransform: 'capitalize' }}>
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
