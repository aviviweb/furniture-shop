// In Next.js 14, route groups like (dashboard) don't affect URLs
// So (dashboard)/page.tsx should be accessible at / already
// But we need a root page.tsx to ensure it works
// Since (dashboard)/page.tsx is a client component, we can't import it directly
// Instead, we'll delete this file and let Next.js use (dashboard)/page.tsx for /
// Actually, let's just create a simple redirect or copy the content
"use client";

// Re-export the dashboard page content
export { default } from './(dashboard)/page';

