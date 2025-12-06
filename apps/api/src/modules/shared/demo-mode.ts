/**
 * Check if the application is in demo mode
 * 
 * Logic:
 * - If DEMO_MODE is explicitly set, use it
 * - Otherwise, default to FALSE in production (Railway/cloud), true only in local development
 */
export function isDemoMode(): boolean {
  // If DEMO_MODE is explicitly set, use it
  if (process.env.DEMO_MODE !== undefined) {
    return process.env.DEMO_MODE !== 'false';
  }
  
  // Default: FALSE in production/cloud (Railway), TRUE only in local development
  // Railway always sets PORT, so if PORT is set and we're not explicitly in development, assume production
  const isLocalDev = process.env.NODE_ENV === 'development' && 
                     !process.env.PORT && 
                     (process.env.DEMO_MODE === undefined);
  
  // In Railway/production: default to FALSE (production mode)
  // In local development: default to TRUE (demo mode)
  return isLocalDev;
}

