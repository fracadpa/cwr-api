import { Plan } from '../../../../domain/plans';
import { PlanEntity } from '../entities/plan.entity';

export class PlanMapper {
  static toDomain(raw: PlanEntity): Plan {
    const domainEntity = new Plan();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.price = raw.price;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Plan): PlanEntity {
    const persistenceEntity = new PlanEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.price = domainEntity.price;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
