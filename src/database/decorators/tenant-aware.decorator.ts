import { SetMetadata } from '@nestjs/common';

export const TENANT_AWARE_KEY = 'TENANT_AWARE';

export interface TenantAwareOptions {
  tenantField?: string; // default: 'tenant'
  companyField?: string; // default: 'company'
}

/**
 * Marks an entity as requiring tenant/company filtering.
 * This decorator is used on entity classes to indicate that queries
 * should be filtered based on the current user's tenant and company.
 *
 * @param options - Optional configuration for field names
 * @returns ClassDecorator
 *
 * @example
 * ```typescript
 * @TenantAware()
 * @Entity()
 * export class ComposerEntity {
 *   // ...
 * }
 * ```
 */
export const TenantAware = (options?: TenantAwareOptions): ClassDecorator =>
  SetMetadata(TENANT_AWARE_KEY, {
    tenantField: options?.tenantField ?? 'tenant',
    companyField: options?.companyField ?? 'company',
  });
