export interface TenantContext {
  tenantId: number | string | null;
  companyId: number | string | null;
  userId: number | string;
  roleId: number | string;
}

export enum FilterScope {
  NONE = 'none', // Admin - no filtering
  TENANT = 'tenant', // User - filter by tenant+company
}

export interface RequestContextData {
  tenantContext: TenantContext;
  filterScope: FilterScope;
}
