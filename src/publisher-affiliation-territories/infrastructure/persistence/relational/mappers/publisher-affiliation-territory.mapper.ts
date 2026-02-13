import { PublisherAffiliationTerritory } from '@app/publisher-affiliation-territories/domain/publisher-affiliation-territory';
import { PublisherAffiliationTerritoryEntity } from '../entities/publisher-affiliation-territory.entity';
import { PublisherAffiliationMapper } from '@app/publisher-affiliations/infrastructure/persistence/relational/mappers/publisher-affiliation.mapper';
import { TerritoryMapper } from '@app/territories/infrastructure/persistence/relational/mappers/territory.mapper';

export class PublisherAffiliationTerritoryMapper {
  static toDomain(
    entity: PublisherAffiliationTerritoryEntity,
  ): PublisherAffiliationTerritory {
    const domain = new PublisherAffiliationTerritory();
    domain.id = entity.id;
    if (entity.publisherAffiliation) {
      domain.publisherAffiliation = PublisherAffiliationMapper.toDomain(
        entity.publisherAffiliation,
      );
    }
    if (entity.territory) {
      domain.territory = TerritoryMapper.toDomain(entity.territory);
    }
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    return domain;
  }

  static toPersistence(
    domain: PublisherAffiliationTerritory,
  ): PublisherAffiliationTerritoryEntity {
    const entity = new PublisherAffiliationTerritoryEntity();
    entity.id = domain.id;
    if (domain.publisherAffiliation) {
      entity.publisherAffiliation = PublisherAffiliationMapper.toPersistence(
        domain.publisherAffiliation,
      );
    }
    if (domain.territory) {
      entity.territory = TerritoryMapper.toPersistence(domain.territory);
    }
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
