import { Artwork } from '../../../../domain/artwork';
import { ArtworkEntity } from '../entities/artwork.entity';
import { CompanyEntity } from '../../../../../companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

export class ArtworkMapper {
  static toDomain(raw: ArtworkEntity): Artwork {
    const domainEntity = new Artwork();
    domainEntity.id = raw.id;
    domainEntity.title = raw.title;
    domainEntity.artist = raw.artist ?? undefined;
    domainEntity.year = raw.year ?? undefined;
    domainEntity.medium = raw.medium ?? undefined;
    domainEntity.dimensions = raw.dimensions ?? undefined;
    domainEntity.price = raw.price ? Number(raw.price) : undefined;
    domainEntity.imageUrl = raw.imageUrl ?? undefined;
    domainEntity.company = raw.company as any;
    domainEntity.tenant = raw.tenant as any;
    domainEntity.createdBy = raw.createdBy as any;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Artwork): ArtworkEntity {
    const persistenceEntity = new ArtworkEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.artist = domainEntity.artist ?? null;
    persistenceEntity.year = domainEntity.year ?? null;
    persistenceEntity.medium = domainEntity.medium ?? null;
    persistenceEntity.dimensions = domainEntity.dimensions ?? null;
    persistenceEntity.price = domainEntity.price ?? null;
    persistenceEntity.imageUrl = domainEntity.imageUrl ?? null;

    // Map company relation
    if (domainEntity.company) {
      const companyEntity = new CompanyEntity();
      if (domainEntity.company.id) {
        companyEntity.id = domainEntity.company.id;
      }
      persistenceEntity.company = companyEntity;
    }

    // Map tenant relation
    if (domainEntity.tenant) {
      const tenantEntity = new TenantEntity();
      if (domainEntity.tenant.id) {
        tenantEntity.id = domainEntity.tenant.id;
      }
      persistenceEntity.tenant = tenantEntity;
    }

    // Map createdBy relation
    if (domainEntity.createdBy) {
      const userEntity = new UserEntity();
      if (domainEntity.createdBy.id) {
        userEntity.id = domainEntity.createdBy.id as number;
      }
      persistenceEntity.createdBy = userEntity;
    }

    if (domainEntity.createdAt) {
      persistenceEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      persistenceEntity.updatedAt = domainEntity.updatedAt;
    }

    return persistenceEntity;
  }
}
