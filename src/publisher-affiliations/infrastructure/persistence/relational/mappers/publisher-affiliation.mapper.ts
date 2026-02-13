import { PublisherAffiliation } from '@app/publisher-affiliations/domain/publisher-affiliation';
import { PublisherAffiliationEntity } from '@app/publisher-affiliations/infrastructure/persistence/relational/entities/publisher-affiliation.entity';
import { PublisherMapper } from '@app/publishers/infrastructure/persistence/relational/mappers/publisher.mapper';
import { SocietyMapper } from '@app/societies/infrastructure/persistence/relational/mappers/society.mapper';

export class PublisherAffiliationMapper {
  static toDomain(entity: PublisherAffiliationEntity): PublisherAffiliation {
    const domain = new PublisherAffiliation();
    domain.id = entity.id;
    domain.publisher = PublisherMapper.toDomain(entity.publisher);
    domain.publicSociety = SocietyMapper.toDomain(entity.publicSociety);
    domain.mechanicalSociety = SocietyMapper.toDomain(entity.mechanicalSociety);
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    return domain;
  }

  static toPersistence(
    domain: PublisherAffiliation,
  ): PublisherAffiliationEntity {
    const entity = new PublisherAffiliationEntity();
    entity.id = domain.id;
    entity.publisher = PublisherMapper.toPersistence(domain.publisher);
    entity.publicSociety = SocietyMapper.toPersistence(domain.publicSociety);
    entity.mechanicalSociety = SocietyMapper.toPersistence(
      domain.mechanicalSociety,
    );
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
