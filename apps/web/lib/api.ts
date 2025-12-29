import { getTenantId } from './tenant';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Get tenant ID for API calls
 * Automatically detects from subdomain or falls back to env/default
 */
function getTenantIdForApi(): string {
  return getTenantId();
}

/**
 * Get JWT token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Get headers for API calls (includes auth token if available)
 */
function getApiHeaders(tenantId: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId,
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

export async function apiGet<T>(path: string, tenantId?: string): Promise<T> {
  try {
    const tid = tenantId || getTenantIdForApi();
    const token = getAuthToken();
    const headers: HeadersInit = { 'x-tenant-id': tid };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_BASE}${path}`, { 
      cache: 'no-store', 
      headers
    });
    
    if (res.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw new Error('נדרשת התחברות מחדש');
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API GET error:', errorText);
      throw new Error(`שגיאת API: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('API GET failed:', error);
    throw error;
  }
}

export async function apiPost<T>(path: string, body: any, tenantId?: string): Promise<T> {
  try {
    const tid = tenantId || getTenantIdForApi();
    const headers = getApiHeaders(tid);
    
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw new Error('נדרשת התחברות מחדש');
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API POST error:', errorText);
      throw new Error(`שגיאת API: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('API POST failed:', error);
    throw error;
  }
}

export async function apiPatch<T>(path: string, body: any, tenantId?: string): Promise<T> {
  try {
    const tid = tenantId || getTenantIdForApi();
    const headers = getApiHeaders(tid);
    
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });
    
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw new Error('נדרשת התחברות מחדש');
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API PATCH error:', errorText);
      throw new Error(`שגיאת API: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('API PATCH failed:', error);
    throw error;
  }
}

export async function apiDelete<T>(path: string, tenantId?: string): Promise<T> {
  try {
    const tid = tenantId || getTenantIdForApi();
    const headers = getApiHeaders(tid);
    
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers,
    });
    
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw new Error('נדרשת התחברות מחדש');
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API DELETE error:', errorText);
      throw new Error(`שגיאת API: ${res.status}`);
    }
    // DELETE might return empty body
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
    return {} as T;
  } catch (error) {
    console.error('API DELETE failed:', error);
    throw error;
  }
}


