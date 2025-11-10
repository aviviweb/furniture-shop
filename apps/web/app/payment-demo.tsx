"use client";
import { useState } from 'react';
import { showToast } from './toast';

type PaymentMethod = 'stripe' | 'paypal' | 'bank';

export function StripePaymentDemo({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Stripe payment processing
    setTimeout(() => {
      setIsProcessing(false);
      showToast('Payment successful! Order confirmed.');
      onSuccess();
    }, 2000);
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
      <h3 style={{ margin: '0 0 16px 0' }}>💳 Credit Card Payment</h3>
      <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: 14 }}>
        Demo payment - No real charges will be made
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Card Number</label>
          <input
            type="text"
            value={cardDetails.number}
            onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
            placeholder="1234 5678 9012 3456"
            required
            style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Expiry Date</label>
            <input
              type="text"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
              placeholder="MM/YY"
              required
              style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>CVV</label>
            <input
              type="text"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
              placeholder="123"
              required
              style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Cardholder Name</label>
          <input
            type="text"
            value={cardDetails.name}
            onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
            placeholder="John Doe"
            required
            style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
          />
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: isProcessing ? '#94a3b8' : '#635bff',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: 16
          }}
        >
          {isProcessing ? 'Processing...' : `Pay ₪${amount.toLocaleString()}`}
        </button>
      </form>
    </div>
  );
}

export function PaymentMethodSelector({ 
  selectedMethod, 
  onMethodChange, 
  amount, 
  onSuccess 
}: { 
  selectedMethod: PaymentMethod; 
  onMethodChange: (method: PaymentMethod) => void; 
  amount: number; 
  onSuccess: () => void; 
}) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Payment Method</h3>
      
      <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="radio"
            name="payment"
            value="stripe"
            checked={selectedMethod === 'stripe'}
            onChange={(e) => onMethodChange(e.target.value as PaymentMethod)}
          />
          <span>💳 Credit Card (Stripe)</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={selectedMethod === 'paypal'}
            onChange={(e) => onMethodChange(e.target.value as PaymentMethod)}
          />
          <span>🅿️ PayPal</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="radio"
            name="payment"
            value="bank"
            checked={selectedMethod === 'bank'}
            onChange={(e) => onMethodChange(e.target.value as PaymentMethod)}
          />
          <span>🏦 Bank Transfer</span>
        </label>
      </div>

      {selectedMethod === 'stripe' && (
        <StripePaymentDemo amount={amount} onSuccess={onSuccess} />
      )}
      
      {selectedMethod === 'paypal' && (
        <div style={{ padding: 20, background: '#f8fafc', borderRadius: 6, textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0' }}>PayPal integration would be implemented here</p>
          <button
            onClick={() => {
              showToast('PayPal payment successful!');
              onSuccess();
            }}
            style={{
              padding: '12px 24px',
              background: '#0070ba',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Pay with PayPal - ₪{amount.toLocaleString()}
          </button>
        </div>
      )}
      
      {selectedMethod === 'bank' && (
        <div style={{ padding: 20, background: '#f8fafc', borderRadius: 6 }}>
          <h4 style={{ margin: '0 0 12px 0' }}>Bank Transfer Details</h4>
          <div style={{ fontSize: 14, marginBottom: 16 }}>
            <div><strong>Bank:</strong> Bank Hapoalim</div>
            <div><strong>Account:</strong> 123456789</div>
            <div><strong>Amount:</strong> ₪{amount.toLocaleString()}</div>
            <div><strong>Reference:</strong> Order #{Date.now()}</div>
          </div>
          <button
            onClick={() => {
              showToast('Bank transfer details copied to clipboard!');
              onSuccess();
            }}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Confirm Bank Transfer
          </button>
        </div>
      )}
    </div>
  );
}
