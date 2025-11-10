export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'furniture-demo';

export async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store', headers: { 'x-tenant-id': TENANT_ID } });
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

export async function apiPost<T>(path: string, body: any): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tenant-id': TENANT_ID },
      body: JSON.stringify(body),
    });
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

export async function apiPatch<T>(path: string, body: any): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-tenant-id': TENANT_ID },
      body: JSON.stringify(body),
    });
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


