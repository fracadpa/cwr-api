import { Composer } from '../../../../domain/composer';
import { ComposerEntity } from '../entities/composer.entity';
import { IpCapacityMapper } from '@app/ip-capacities/infrastructure/persistence/relational/mappers/ip-capacity.mapper';
import { CompanyMapper } from '@app/companies/infrastructure/persistence/relational/mappers/company.mapper';
import { TenantMapper } from '@app/tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

export class ComposerMapper {
  static toDomain(entity: ComposerEntity): Composer {
    const domain = new Composer();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.code = entity.code;
    domain.controlledComposer = entity.controlledComposer;
    domain.ipiComposer = entity.ipiComposer;
    domain.composerAlias = entity.composerAlias;
    if (entity.ipCapacity) {
      domain.ipCapacity = IpCapacityMapper.toDomain(entity.ipCapacity);
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

  static toPersistence(domain: Composer): ComposerEntity {
    const entity = new ComposerEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.code = domain.code;
    entity.controlledComposer = domain.controlledComposer;
    entity.ipiComposer = domain.ipiComposer ?? null;
    entity.composerAlias = domain.composerAlias ?? null;
    if (domain.ipCapacity) {
      entity.ipCapacity = IpCapacityMapper.toPersistence(domain.ipCapacity);
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
