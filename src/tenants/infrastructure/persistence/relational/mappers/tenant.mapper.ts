import { Tenant } from '../../../../domain/tenants';
import { TenantEntity } from '../entities/tenant.entity';
import { CompanyEntity } from '../../../../../companies/infrastructure/persistence/relational/entities/company.entity'; // Import CompanyEntity

export class TenantMapper {
  static toDomain(raw: TenantEntity): Tenant {
    const domainEntity = new Tenant();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.company = raw.company as any; // Cast to any for now
    domainEntity.users = raw.users as any; // Cast to any
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Tenant): TenantEntity {
    const persistenceEntity = new TenantEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;

    // Map company
    if (domainEntity.company) {
      persistenceEntity.company = new CompanyEntity();
      persistenceEntity.company.id = domainEntity.company.id;
    }

    // For OneToMany relations (users), handle similarly to CompanyMapper
    // Assigning only IDs if relationships are managed elsewhere
    // or map full UserEntity instances if they are intended to be saved/updated with the Tenant

    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
