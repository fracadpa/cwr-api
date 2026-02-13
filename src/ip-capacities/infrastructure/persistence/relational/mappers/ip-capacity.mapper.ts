import { IpCapacity } from '../../../../domain/ip-capacity';
import { IpCapacityEntity } from '../entities/ip-capacity.entity';

export class IpCapacityMapper {
  static toDomain(raw: IpCapacityEntity): IpCapacity {
    const domainEntity = new IpCapacity();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.code = raw.code;
    domainEntity.cwrCapacity = raw.cwrCapacity;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: IpCapacity): IpCapacityEntity {
    const persistenceEntity = new IpCapacityEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.code = domainEntity.code;
    persistenceEntity.cwrCapacity = domainEntity.cwrCapacity;

    if (domainEntity.createdAt) {
      persistenceEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      persistenceEntity.updatedAt = domainEntity.updatedAt;
    }

    return persistenceEntity;
  }
}
