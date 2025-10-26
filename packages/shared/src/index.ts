export type Role = 'SUPER_ADMIN' | 'OWNER' | 'ADMIN' | 'STAFF' | 'INSTALLER';

export type DemoMode = 'demo' | 'live';

export interface TenantContext {
  tenantId: string;
  mode: DemoMode;
}

export const statusToColor: Record<string, string> = {
  awaitingApproval: '#f59e0b',
  approved: '#0ea5e9',
  inProgress: '#6366f1',
  completed: '#10b981',
};


