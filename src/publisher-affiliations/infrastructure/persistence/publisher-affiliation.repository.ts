import { PublisherAffiliation } from '@app/publisher-affiliations/domain/publisher-affiliation';
import { CreatePublisherAffiliationDto } from '@app/publisher-affiliations/dto/create-publisher-affiliation.dto';
import { UpdatePublisherAffiliationDto } from '@app/publisher-affiliations/dto/update-publisher-affiliation.dto';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { NullableType } from '@app/utils/types/nullable.type';
import { EntityCondition } from '@app/utils/types/entity-condition.type';

export abstract class PublisherAffiliationRepository {
  abstract create(
    createPayload: CreatePublisherAffiliationDto,
  ): Promise<PublisherAffiliation>;

  abstract findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<PublisherAffiliation[]>;

  abstract findOne(
    fields: EntityCondition<PublisherAffiliation>,
  ): Promise<NullableType<PublisherAffiliation>>;

  abstract findByPublisherId(
    publisherId: number,
    paginationOptions: IPaginationOptions,
  ): Promise<PublisherAffiliation[]>;

  abstract update(
    id: PublisherAffiliation['id'],
    updatePayload: UpdatePublisherAffiliationDto,
  ): Promise<PublisherAffiliation>;

  abstract softDelete(id: PublisherAffiliation['id']): Promise<void>;
}
