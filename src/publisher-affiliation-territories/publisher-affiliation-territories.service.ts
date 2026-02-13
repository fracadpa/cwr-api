import { Injectable } from '@nestjs/common';
import { PublisherAffiliationTerritoryRepository } from './infrastructure/persistence/publisher-affiliation-territory.repository';
import { CreatePublisherAffiliationTerritoryDto } from './dto/create-publisher-affiliation-territory.dto';
import { UpdatePublisherAffiliationTerritoryDto } from './dto/update-publisher-affiliation-territory.dto';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { PublisherAffiliationTerritory } from './domain/publisher-affiliation-territory';
import { EntityCondition } from '@app/utils/types/entity-condition.type';
import { NullableType } from '@app/utils/types/nullable.type';

@Injectable()
export class PublisherAffiliationTerritoriesService {
  constructor(
    private readonly publisherAffiliationTerritoryRepository: PublisherAffiliationTerritoryRepository,
  ) {}

  create(
    createPayload: CreatePublisherAffiliationTerritoryDto,
  ): Promise<PublisherAffiliationTerritory> {
    return this.publisherAffiliationTerritoryRepository.create(createPayload);
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    filterOptions?: { publisherId?: number | null },
  ): Promise<PublisherAffiliationTerritory[]> {
    return this.publisherAffiliationTerritoryRepository.findManyWithPagination(
      paginationOptions,
      filterOptions,
    );
  }

  findOne(
    fields: EntityCondition<PublisherAffiliationTerritory>,
  ): Promise<NullableType<PublisherAffiliationTerritory>> {
    return this.publisherAffiliationTerritoryRepository.findOne(fields);
  }

  update(
    id: PublisherAffiliationTerritory['id'],
    updatePayload: UpdatePublisherAffiliationTerritoryDto,
  ): Promise<PublisherAffiliationTerritory> {
    return this.publisherAffiliationTerritoryRepository.update(
      id,
      updatePayload,
    );
  }

  remove(id: PublisherAffiliationTerritory['id']): Promise<void> {
    return this.publisherAffiliationTerritoryRepository.softDelete(id);
  }
}
