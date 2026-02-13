import { Society } from '../../../../domain/society';
import { SocietyEntity } from '../entities/society.entity';

export class SocietyMapper {
  static toDomain(raw: SocietyEntity): Society {
    const domainEntity = new Society();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.cwrSocietyId = raw.cwrSocietyId;
    domainEntity.cwrSociety = raw.cwrSociety
      ? SocietyMapper.toDomain(raw.cwrSociety)
      : null;
    domainEntity.cwrVer = raw.cwrVer;
    domainEntity.cisacCode = raw.cisacCode;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Society): SocietyEntity {
    const persistenceEntity = new SocietyEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.cwrSocietyId = domainEntity.cwrSocietyId ?? null;
    persistenceEntity.cwrVer = domainEntity.cwrVer;
    persistenceEntity.cisacCode = domainEntity.cisacCode;

    if (domainEntity.createdAt) {
      persistenceEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      persistenceEntity.updatedAt = domainEntity.updatedAt;
    }

    return persistenceEntity;
  }
}
