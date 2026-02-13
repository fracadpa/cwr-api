import { Territory } from '../../../../domain/territory';
import { TerritoryEntity } from '../entities/territory.entity';

export class TerritoryMapper {
  static toDomain(raw: TerritoryEntity): Territory {
    const domainEntity = new Territory();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.tisCode = raw.tisCode;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Territory): TerritoryEntity {
    const persistenceEntity = new TerritoryEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.tisCode = domainEntity.tisCode;

    if (domainEntity.createdAt) {
      persistenceEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      persistenceEntity.updatedAt = domainEntity.updatedAt;
    }

    return persistenceEntity;
  }
}
