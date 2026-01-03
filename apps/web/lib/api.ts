import { getTenantId } from './tenant';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Debug: Log API base URL on client side
if (typeof window !== 'undefined') {
  console.log('🔧 API_BASE:', API_BASE);
  console.log('🔧 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error('❌ NEXT_PUBLIC_API_URL is not set! Please add it in Render → furniture-web → Environment');
  }
}

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
    
    // For login, don't send tenant-id header (it's not needed)
    if (path === '/auth/login') {
      delete headers['x-tenant-id'];
    }
    
    const url = `${API_BASE}${path}`;
    console.log('🔗 API POST:', { url, path, apiBase: API_BASE });
    
    const res = await fetch(url, {
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
      let errorMessage = `שגיאת API: ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } catch {
        // If response is not JSON, try text
        try {
          const errorText = await res.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch {
          // Ignore
        }
      }
      console.error('API POST error:', {
        path,
        status: res.status,
        statusText: res.statusText,
        message: errorMessage,
        url: `${API_BASE}${path}`,
      });
      throw new Error(errorMessage);
    }
    return res.json();
  } catch (error: any) {
    const url = `${API_BASE}${path}`;
    console.error('❌ API POST failed:', {
      path,
      error: error?.message || error,
      url,
      apiBase: API_BASE,
      hasApiUrl: !!process.env.NEXT_PUBLIC_API_URL,
    });
    // If it's a network error, provide a more helpful message
    if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError') || error?.message?.includes('cannot')) {
      const errorMsg = !process.env.NEXT_PUBLIC_API_URL 
        ? `לא ניתן להתחבר לשרת. ה-API URL לא מוגדר. בדוק את NEXT_PUBLIC_API_URL ב-Render. (ניסיתי: ${url})`
        : `לא ניתן להתחבר לשרת. בדוק את חיבור האינטרנט או שהשרת רץ. (URL: ${url})`;
      throw new Error(errorMsg);
    }
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


