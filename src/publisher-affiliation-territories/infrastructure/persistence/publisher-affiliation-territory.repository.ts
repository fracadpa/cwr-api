import { PublisherAffiliationTerritory } from '../../domain/publisher-affiliation-territory';
import { CreatePublisherAffiliationTerritoryDto } from '../../dto/create-publisher-affiliation-territory.dto';
import { UpdatePublisherAffiliationTerritoryDto } from '../../dto/update-publisher-affiliation-territory.dto';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { EntityCondition } from '@app/utils/types/entity-condition.type';
import { NullableType } from '@app/utils/types/nullable.type';

export abstract class PublisherAffiliationTerritoryRepository {
  abstract create(
    createPayload: CreatePublisherAffiliationTerritoryDto,
  ): Promise<PublisherAffiliationTerritory>;

  abstract findManyWithPagination(
    paginationOptions: IPaginationOptions,
    filterOptions?: { publisherId?: number | null },
  ): Promise<PublisherAffiliationTerritory[]>;

  abstract findOne(
    fields: EntityCondition<PublisherAffiliationTerritory>,
  ): Promise<NullableType<PublisherAffiliationTerritory>>;

  abstract update(
    id: PublisherAffiliationTerritory['id'],
    updatePayload: UpdatePublisherAffiliationTerritoryDto,
  ): Promise<PublisherAffiliationTerritory>;

  abstract softDelete(id: PublisherAffiliationTerritory['id']): Promise<void>;
}
