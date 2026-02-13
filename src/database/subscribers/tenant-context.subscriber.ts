import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { RequestContextService } from '../../request-context/request-context.service';

/**
 * TypeORM subscriber that automatically populates company and tenant
 * relations on entities during insert/update operations.
 *
 * - Admin users (FilterScope.NONE): subscriber does nothing, DTO values flow through
 * - Non-admin users (FilterScope.TENANT): company/tenant are set from request context,
 *   overriding any values the client may have sent (security enforcement)
 */
@EventSubscriber()
export class TenantContextSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<any>): void {
    this.applyTenantContext(event);
  }

  beforeUpdate(event: UpdateEvent<any>): void {
    this.applyTenantContext(event);
  }

  private applyTenantContext(event: InsertEvent<any> | UpdateEvent<any>): void {
    // Skip if no request context (e.g., migrations, seeds, CLI commands)
    const context = RequestContextService.getContext();
    if (!context) {
      return;
    }

    // Admin users bypass — DTO values are used as-is
    if (RequestContextService.isAdmin()) {
      return;
    }

    const entity = event.entity;
    if (!entity) {
      return;
    }

    const metadata = event.metadata;
    const companyId = RequestContextService.getCompanyId();
    const tenantId = RequestContextService.getTenantId();

    // Check entity metadata for 'company' relation and set from context
    if (companyId != null) {
      const hasCompanyRelation = metadata.relations.some(
        (relation) => relation.propertyName === 'company',
      );
      if (hasCompanyRelation) {
        entity.company = { id: companyId };
      }
    }

    // Check entity metadata for 'tenant' relation and set from context
    if (tenantId != null) {
      const hasTenantRelation = metadata.relations.some(
        (relation) => relation.propertyName === 'tenant',
      );
      if (hasTenantRelation) {
        entity.tenant = { id: tenantId };
      }
    }
  }
}
