import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { PublisherAffiliationTerritoryRepository } from '@app/publisher-affiliation-territories/infrastructure/persistence/publisher-affiliation-territory.repository';
import { PublisherAffiliationTerritory } from '@app/publisher-affiliation-territories/domain/publisher-affiliation-territory';
import { PublisherAffiliationTerritoryEntity } from '../entities/publisher-affiliation-territory.entity';
import { PublisherAffiliationTerritoryMapper } from '../mappers/publisher-affiliation-territory.mapper';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { CreatePublisherAffiliationTerritoryDto } from '@app/publisher-affiliation-territories/dto/create-publisher-affiliation-territory.dto';
import { UpdatePublisherAffiliationTerritoryDto } from '@app/publisher-affiliation-territories/dto/update-publisher-affiliation-territory.dto';
import { PublisherAffiliationEntity } from '@app/publisher-affiliations/infrastructure/persistence/relational/entities/publisher-affiliation.entity';
import { TerritoryEntity } from '@app/territories/infrastructure/persistence/relational/entities/territory.entity';
import { EntityCondition } from '@app/utils/types/entity-condition.type';
import { NullableType } from '@app/utils/types/nullable.type';
import { applyTenantFilter } from '@app/database/utils/apply-tenant-filter';

@Injectable()
export class PublisherAffiliationTerritoryRelationalRepository
  implements PublisherAffiliationTerritoryRepository
{
  constructor(
    @InjectRepository(PublisherAffiliationTerritoryEntity)
    private readonly publisherAffiliationTerritoryRepository: Repository<PublisherAffiliationTerritoryEntity>,
    @InjectRepository(PublisherAffiliationEntity)
    private readonly publisherAffiliationRepository: Repository<PublisherAffiliationEntity>,
    @InjectRepository(TerritoryEntity)
    private readonly territoryRepository: Repository<TerritoryEntity>,
  ) {}

  async create(
    createPayload: CreatePublisherAffiliationTerritoryDto,
  ): Promise<PublisherAffiliationTerritory> {
    const publisherAffiliation =
      await this.publisherAffiliationRepository.findOne({
        where: { id: createPayload.publisherAffiliationId },
      });
    if (!publisherAffiliation) {
      throw new Error('Publisher Affiliation not found');
    }

    const territory = await this.territoryRepository.findOne({
      where: { id: createPayload.territoryId },
    });
    if (!territory) {
      throw new Error('Territory not found');
    }

    const entity = this.publisherAffiliationTerritoryRepository.create({
      publisherAffiliation,
      territory,
    });

    const savedEntity =
      await this.publisherAffiliationTerritoryRepository.save(entity);
    return PublisherAffiliationTerritoryMapper.toDomain(savedEntity);
  }

  async findManyWithPagination(
    paginationOptions: IPaginationOptions,
    filterOptions?: { publisherId?: number | null },
  ): Promise<PublisherAffiliationTerritory[]> {
    const baseWhere: FindOptionsWhere<PublisherAffiliationTerritoryEntity> = {};
    if (filterOptions?.publisherId) {
      baseWhere.publisherAffiliation = {
        publisher: {
          id: filterOptions.publisherId,
        },
      };
    }

    const where = applyTenantFilter<PublisherAffiliationTerritoryEntity>(
      baseWhere,
      { hasTenant: true, hasCompany: true },
    );

    const entities = await this.publisherAffiliationTerritoryRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
    });
    return entities.map((entity) =>
      PublisherAffiliationTerritoryMapper.toDomain(entity),
    );
  }

  async findOne(
    fields: EntityCondition<PublisherAffiliationTerritory>,
  ): Promise<NullableType<PublisherAffiliationTerritory>> {
    const baseWhere = fields
      ? (fields as FindOptionsWhere<PublisherAffiliationTerritoryEntity>)
      : {};
    const where = applyTenantFilter<PublisherAffiliationTerritoryEntity>(
      baseWhere,
      { hasTenant: true, hasCompany: true },
    );

    const entity = await this.publisherAffiliationTerritoryRepository.findOne({
      where,
    });

    return entity ? PublisherAffiliationTerritoryMapper.toDomain(entity) : null;
  }

  async update(
    id: PublisherAffiliationTerritory['id'],
    updatePayload: UpdatePublisherAffiliationTerritoryDto,
  ): Promise<PublisherAffiliationTerritory> {
    const where = applyTenantFilter<PublisherAffiliationTerritoryEntity>(
      { id },
      { hasTenant: true, hasCompany: true },
    );

    const entity = await this.publisherAffiliationTerritoryRepository.findOne({
      where,
    });

    if (!entity) {
      throw new Error('Publisher Affiliation Territory not found');
    }

    if (updatePayload.publisherAffiliationId) {
      const publisherAffiliation =
        await this.publisherAffiliationRepository.findOne({
          where: { id: updatePayload.publisherAffiliationId },
        });
      if (!publisherAffiliation) {
        throw new Error('Publisher Affiliation not found');
      }
      entity.publisherAffiliation = publisherAffiliation;
    }

    if (updatePayload.territoryId) {
      const territory = await this.territoryRepository.findOne({
        where: { id: updatePayload.territoryId },
      });
      if (!territory) {
        throw new Error('Territory not found');
      }
      entity.territory = territory;
    }

    const updatedEntity =
      await this.publisherAffiliationTerritoryRepository.save(entity);
    return PublisherAffiliationTerritoryMapper.toDomain(updatedEntity);
  }

  async softDelete(id: PublisherAffiliationTerritory['id']): Promise<void> {
    const where = applyTenantFilter<PublisherAffiliationTerritoryEntity>(
      { id },
      { hasTenant: true, hasCompany: true },
    );

    await this.publisherAffiliationTerritoryRepository.delete(where);
  }
}
