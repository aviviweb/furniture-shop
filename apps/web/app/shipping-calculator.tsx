"use client";
import { useState } from 'react';
import { showToast } from '../../toast';

type ShippingOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
};

const shippingOptions: ShippingOption[] = [
  { id: 'standard', name: 'Standard Delivery', description: 'Regular shipping', price: 50, estimatedDays: '3-5 business days' },
  { id: 'express', name: 'Express Delivery', description: 'Fast shipping', price: 80, estimatedDays: '1-2 business days' },
  { id: 'overnight', name: 'Overnight Delivery', description: 'Next day delivery', price: 120, estimatedDays: 'Next business day' },
];

export function ShippingCalculator({ cartItems }: { cartItems: any[] }) {
  const [selectedOption, setSelectedOption] = useState('standard');
  const [zipCode, setZipCode] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState(50);

  const calculateShipping = () => {
    if (!zipCode) {
      showToast('Please enter a ZIP code');
      return;
    }

    const basePrice = shippingOptions.find(opt => opt.id === selectedOption)?.price || 50;
    const weightFactor = cartItems.length * 5; // 5 shekels per item
    const distanceFactor = zipCode.startsWith('1') ? 0 : 20; // Tel Aviv vs other cities
    
    const totalPrice = basePrice + weightFactor + distanceFactor;
    setCalculatedPrice(totalPrice);
    showToast(`Shipping calculated: ₪${totalPrice}`);
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, marginTop: 16 }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Shipping Calculator</h3>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>ZIP Code</label>
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Enter ZIP code"
          style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Shipping Method</label>
        <div style={{ display: 'grid', gap: 8 }}>
          {shippingOptions.map((option) => (
            <label key={option.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{option.name}</div>
                <div style={{ fontSize: 14, color: '#64748b' }}>{option.description} - {option.estimatedDays}</div>
              </div>
              <div style={{ fontWeight: 'bold' }}>₪{option.price}</div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={calculateShipping}
        style={{
          width: '100%',
          padding: '12px 24px',
          background: '#0ea5e9',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Calculate Shipping
      </button>

      {calculatedPrice > 0 && (
        <div style={{ marginTop: 16, padding: 12, background: '#f0f9ff', borderRadius: 6, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#0369a1' }}>
            Estimated Shipping: ₪{calculatedPrice}
          </div>
        </div>
      )}
    </div>
  );
}
