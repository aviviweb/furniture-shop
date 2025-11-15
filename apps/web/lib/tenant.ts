/**
 * Utility functions for tenant/subdomain handling
 */

/**
 * Extract tenant ID from hostname (subdomain)
 * Example: client1.yourdomain.com -> client1
 */
export function getTenantIdFromHostname(): string | null {
  if (typeof window === 'undefined') {
    // Server-side: get from headers (set by middleware)
    return null;
  }
  
  const hostname = window.location.hostname;
  
  // Skip if it's localhost or IP address
  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }
  
  const parts = hostname.split('.');
  
  // If we have more than 2 parts, there's a subdomain
  if (parts.length > 2) {
    const firstPart = parts[0];
    // Skip known special subdomains
    if (firstPart !== 'www' && firstPart !== 'api' && firstPart !== 'admin') {
      return firstPart;
    }
  }
  
  return null;
}

/**
 * Get tenant ID - from subdomain, env var, or default
 */
export function getTenantId(): string {
  // Try to get from subdomain first
  const subdomainTenant = getTenantIdFromHostname();
  if (subdomainTenant) {
    return subdomainTenant;
  }
  
  // Fallback to env var
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const tenantFromUrl = urlParams.get('tenantId');
    if (tenantFromUrl) {
      return tenantFromUrl;
    }
  }
  
  // Default fallback
  return process.env.NEXT_PUBLIC_TENANT_ID || 'furniture-demo';
}

/**
 * Load tenant settings from API
 */
export async function loadTenantSettings(tenantId: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  
  try {
    const response = await fetch(`${API_BASE}/companies/me`, {
      headers: {
        'x-tenant-id': tenantId,
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load tenant settings: ${response.status}`);
    }
    
    const company = await response.json();
    return {
      tenantId: company.tenantId || tenantId,
      brandName: company.brand?.primaryColor 
        ? company.name 
        : (process.env.NEXT_PUBLIC_BRAND_NAME || 'Furniture Demo'),
      primaryColor: company.brand?.primaryColor || process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#0ea5e9',
      secondaryColor: company.brand?.secondaryColor || '#10b981',
      logoUrl: company.brand?.logoUrl || null,
      company: company,
    };
  } catch (error) {
    console.error('Error loading tenant settings:', error);
    // Return defaults on error
    return {
      tenantId,
      brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'Furniture Demo',
      primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#0ea5e9',
      secondaryColor: '#10b981',
      logoUrl: null,
      company: null,
    };
  }
}

