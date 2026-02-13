import { SetMetadata } from '@nestjs/common';

export const SKIP_TENANT_FILTER_KEY = 'SKIP_TENANT_FILTER';

/**
 * Decorator to bypass tenant/company filtering for a specific handler.
 * Use this on controller methods that need to access data across tenants.
 *
 * @returns MethodDecorator
 *
 * @example
 * ```typescript
 * @SkipTenantFilter()
 * @Get('all')
 * findAllAcrossTenants() {
 *   // This will bypass tenant filtering
 * }
 * ```
 */
export const SkipTenantFilter = () => SetMetadata(SKIP_TENANT_FILTER_KEY, true);
