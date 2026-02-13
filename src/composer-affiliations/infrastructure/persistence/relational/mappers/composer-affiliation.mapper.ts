import { ComposerAffiliation } from '@app/composer-affiliations/domain/composer-affiliation';
import { ComposerAffiliationEntity } from '../entities/composer-affiliation.entity';
import { ComposerMapper } from '@app/composers/infrastructure/persistence/relational/mappers/composer.mapper';
import { SocietyMapper } from '@app/societies/infrastructure/persistence/relational/mappers/society.mapper';
import { CompanyMapper } from '@app/companies/infrastructure/persistence/relational/mappers/company.mapper';
import { TenantMapper } from '@app/tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

export class ComposerAffiliationMapper {
  static toDomain(entity: ComposerAffiliationEntity): ComposerAffiliation {
    const domain = new ComposerAffiliation();
    domain.id = entity.id;
    if (entity.composer) {
      domain.composer = ComposerMapper.toDomain(entity.composer);
    }
    if (entity.publicSociety) {
      domain.publicSociety = SocietyMapper.toDomain(entity.publicSociety);
    }
    if (entity.mechanicalSociety) {
      domain.mechanicalSociety = SocietyMapper.toDomain(
        entity.mechanicalSociety,
      );
    }
    if (entity.company) {
      domain.company = CompanyMapper.toDomain(entity.company);
    }
    if (entity.tenant) {
      domain.tenant = TenantMapper.toDomain(entity.tenant);
    }
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    return domain;
  }

  static toPersistence(domain: ComposerAffiliation): ComposerAffiliationEntity {
    const entity = new ComposerAffiliationEntity();
    entity.id = domain.id;
    if (domain.composer) {
      entity.composer = ComposerMapper.toPersistence(domain.composer);
    }
    if (domain.publicSociety) {
      entity.publicSociety = SocietyMapper.toPersistence(domain.publicSociety);
    }
    if (domain.mechanicalSociety) {
      entity.mechanicalSociety = SocietyMapper.toPersistence(
        domain.mechanicalSociety,
      );
    }
    if (domain.company) {
      entity.company = CompanyMapper.toPersistence(domain.company);
    }
    if (domain.tenant) {
      entity.tenant = TenantMapper.toPersistence(domain.tenant);
    }
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
