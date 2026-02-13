import { Subscription } from '../../../../domain/subscriptions';
import { SubscriptionEntity } from '../entities/subscription.entity';
import { CompanyEntity } from '../../../../../companies/infrastructure/persistence/relational/entities/company.entity';
import { PlanEntity } from '../../../../../plans/infrastructure/persistence/relational/entities/plan.entity';

export class SubscriptionMapper {
  static toDomain(raw: SubscriptionEntity): Subscription {
    const domainEntity = new Subscription();
    domainEntity.id = raw.id;
    domainEntity.status = raw.status;
    domainEntity.company = raw.company;
    domainEntity.plan = raw.plan;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Subscription): SubscriptionEntity {
    const persistenceEntity = new SubscriptionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.status = domainEntity.status;

    if (domainEntity.company) {
      persistenceEntity.company = new CompanyEntity();
      persistenceEntity.company.id = domainEntity.company.id;
    }

    if (domainEntity.plan) {
      persistenceEntity.plan = new PlanEntity();
      persistenceEntity.plan.id = domainEntity.plan.id;
    }

    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
