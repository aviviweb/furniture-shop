"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '../../lib/api';
import { showToast } from '../toast';

// Force this route to be included in build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Debug: Log API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    console.log('🔧 Login attempt - API URL:', apiUrl);
    if (!process.env.NEXT_PUBLIC_API_URL) {
      setError('NEXT_PUBLIC_API_URL לא מוגדר. בדוק את ה-Environment Variables ב-Render.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await apiPost<{ token: string; role: string }>('/auth/login', {
        email,
        password,
      });
      
      // Save token to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      
      showToast('התחברת בהצלחה!', 'success');
      
      // Redirect to dashboard
      router.push('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error?.message || 'שגיאה בהתחברות. בדוק את האימייל והסיסמה.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      
      // Also log to console for debugging
      console.error('Login error details:', {
        message: error?.message,
        stack: error?.stack,
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f7f7f7' }}>
      <div style={{ 
        background: '#fff', 
        padding: 32, 
        borderRadius: 8, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        minWidth: 320,
        maxWidth: 400
      }}>
        <h2 className="text-3xl" style={{ marginTop: 0, marginBottom: 24, textAlign: 'center' }}>כניסה</h2>
        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: 4,
            color: '#991b1b',
            marginBottom: 16,
            fontSize: 14,
            textAlign: 'right',
          }}>
            <strong>שגיאה:</strong> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              אימייל
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="אימייל"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: 4,
                fontSize: 16,
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              סיסמה
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: 4,
                fontSize: 16,
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#94a3b8' : '#0ea5e9',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontSize: 16,
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
        
        <div style={{ marginTop: 24, padding: 16, background: '#f1f5f9', borderRadius: 4, fontSize: 12 }}>
          <strong>משתמשי דמו:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingRight: 20, listStyle: 'none' }}>
            <li>Super Admin: <code>super@platform.local</code> / <code>changeme</code></li>
            <li>Owner: <code>owner1@demo.local</code> / <code>changeme</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}


