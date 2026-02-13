import { Company } from '@app/companies/domain/companies'; // Corrected
import { CompanyEntity } from '@app/companies/infrastructure/persistence/relational/entities/company.entity'; // Corrected
import { SubscriptionEntity } from '@app/subscriptions/infrastructure/persistence/relational/entities/subscription.entity'; // Corrected

export class CompanyMapper {
  static toDomain(raw: CompanyEntity): Company {
    const domainEntity = new Company();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    // For relations, you typically map them to domain objects here if needed
    // For simplicity, directly assigning raw relations if they are eager loaded
    domainEntity.tenants = raw.tenants as any; // Cast to any for now to avoid deep mapping issues
    domainEntity.subscriptions = raw.subscriptions as any; // Cast to any
    domainEntity.activeSubscription = raw.activeSubscription as any; // Cast to any
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Company): CompanyEntity {
    const persistenceEntity = new CompanyEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;

    // Map activeSubscription
    if (domainEntity.activeSubscription) {
      const subscriptionEntity = new SubscriptionEntity();
      if (domainEntity.activeSubscription.id) {
        subscriptionEntity.id = domainEntity.activeSubscription.id;
      }
      persistenceEntity.activeSubscription = subscriptionEntity;
    } else {
      // Handles both undefined and null
      persistenceEntity.activeSubscription = null;
    }

    // For OneToMany relations, it's usually handled when saving the owning side
    // or by assigning an array of already-persisted entities.
    // For now, if tenants and subscriptions are not directly being saved with company,
    // we can omit them or just assign their IDs if only the relationship matters.
    // Assuming for now that tenants and subscriptions are managed independently or through their own services.

    // If you need to manage tenants directly from here (e.g. creating/updating them)
    // you would need a loop here to map each Tenant domain object to a TenantEntity
    // For simpler cases where you just want to set the relationship by ID, you can do:
    // persistenceEntity.tenants = domainEntity.tenants?.map(tenant => ({ id: tenant.id })) as TenantEntity[];

    if (domainEntity.createdAt) {
      persistenceEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      persistenceEntity.updatedAt = domainEntity.updatedAt;
    }

    return persistenceEntity;
  }
}
