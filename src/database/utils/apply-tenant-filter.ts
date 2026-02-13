import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { RequestContextService } from '../../request-context/request-context.service';
import { FilterScope } from '../../request-context/request-context.interface';

export interface TenantFilterOptions {
  /**
   * Whether the entity has a tenant relation
   * @default false
   */
  hasTenant?: boolean;

  /**
   * Whether the entity has a company relation
   * @default false
   */
  hasCompany?: boolean;

  /**
   * Custom field name for tenant relation
   * @default 'tenant'
   */
  tenantField?: string;

  /**
   * Custom field name for company relation
   * @default 'company'
   */
  companyField?: string;
}

/**
 * Applies tenant and company filtering to a TypeORM where clause based on
 * the current request context.
 *
 * - Admin users (FilterScope.NONE) bypass all filtering
 * - Regular users (FilterScope.TENANT) get filtered by tenant and company
 *
 * @param where - Existing where clause to extend
 * @param options - Configuration for which fields to filter
 * @returns Extended where clause with tenant/company filters applied
 *
 * @example
 * ```typescript
 * // In a repository method
 * async findManyWithPagination(options: IPaginationOptions): Promise<Entity[]> {
 *   const where = applyTenantFilter<EntityType>({}, {
 *     hasTenant: true,
 *     hasCompany: true
 *   });
 *
 *   return this.repository.find({ where });
 * }
 * ```
 */
export function applyTenantFilter<T extends ObjectLiteral>(
  where: FindOptionsWhere<T> = {} as FindOptionsWhere<T>,
  options?: TenantFilterOptions,
): FindOptionsWhere<T> {
  const scope = RequestContextService.getFilterScope();

  // Admin bypass - no filtering
  if (scope === FilterScope.NONE) {
    return where;
  }

  // Clone the where clause to avoid mutation
  const filter = { ...where } as Record<string, unknown>;

  const tenantField = options?.tenantField ?? 'tenant';
  const companyField = options?.companyField ?? 'company';

  // Apply company filter if entity has company relation
  if (options?.hasCompany) {
    const companyId = RequestContextService.getCompanyId();
    if (companyId) {
      filter[companyField] = { id: companyId };
    }
  }

  // Apply tenant filter if entity has tenant relation
  if (options?.hasTenant) {
    const tenantId = RequestContextService.getTenantId();
    if (tenantId) {
      filter[tenantField] = { id: tenantId };
    }
  }

  return filter as FindOptionsWhere<T>;
}

/**
 * Checks if tenant filtering should be applied based on current context.
 * Returns true if the current user is not an admin.
 *
 * @returns boolean indicating whether filtering should be applied
 */
export function shouldApplyTenantFilter(): boolean {
  return RequestContextService.getFilterScope() !== FilterScope.NONE;
}

/**
 * Gets the current tenant ID from the request context.
 * Returns null if no tenant context is available.
 *
 * @returns The tenant ID or null
 */
export function getCurrentTenantId(): number | string | null {
  return RequestContextService.getTenantId();
}

/**
 * Gets the current company ID from the request context.
 * Returns null if no company context is available.
 *
 * @returns The company ID or null
 */
export function getCurrentCompanyId(): number | string | null {
  return RequestContextService.getCompanyId();
}
