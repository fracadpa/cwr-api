import { Tenant } from '../../../../domain/tenants'; // Corrected
import { TenantSchemaClass } from '../entities/tenant.schema'; // Corrected

export class TenantMapper {
  // Corrected
  public static toDomain(raw: TenantSchemaClass): Tenant {
    // Corrected
    const domainEntity = new Tenant(); // Corrected
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Tenant): TenantSchemaClass {
    // Corrected
    const persistenceSchema = new TenantSchemaClass(); // Corrected
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
