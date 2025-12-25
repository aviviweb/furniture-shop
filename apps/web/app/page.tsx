// Re-export dashboard page as root page
// In Next.js 14, route groups like (dashboard) don't affect URLs
// So (dashboard)/page.tsx should be accessible at /, but we need a root page.tsx
export { default } from './(dashboard)/page';

