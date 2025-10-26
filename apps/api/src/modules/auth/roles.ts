import { SetMetadata } from '@nestjs/common';

export type Role = 'SUPER_ADMIN' | 'OWNER' | 'ADMIN' | 'STAFF' | 'INSTALLER';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);


