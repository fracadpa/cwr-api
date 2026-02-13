import { Injectable } from '@nestjs/common';
import { PublisherAffiliationRepository } from '@app/publisher-affiliations/infrastructure/persistence/publisher-affiliation.repository';
import { CreatePublisherAffiliationDto } from '@app/publisher-affiliations/dto/create-publisher-affiliation.dto';
import { UpdatePublisherAffiliationDto } from '@app/publisher-affiliations/dto/update-publisher-affiliation.dto';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { PublisherAffiliation } from '@app/publisher-affiliations/domain/publisher-affiliation';
import { EntityCondition } from '@app/utils/types/entity-condition.type';
import { NullableType } from '@app/utils/types/nullable.type';

@Injectable()
export class PublisherAffiliationsService {
  constructor(
    private readonly publisherAffiliationRepository: PublisherAffiliationRepository,
  ) {}

  create(
    createPublisherAffiliationDto: CreatePublisherAffiliationDto,
  ): Promise<PublisherAffiliation> {
    return this.publisherAffiliationRepository.create(
      createPublisherAffiliationDto,
    );
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<PublisherAffiliation[]> {
    return this.publisherAffiliationRepository.findManyWithPagination(
      paginationOptions,
    );
  }

  findOne(
    fields: EntityCondition<PublisherAffiliation>,
  ): Promise<NullableType<PublisherAffiliation>> {
    return this.publisherAffiliationRepository.findOne(fields);
  }

  findByPublisherId(
    publisherId: number,
    paginationOptions: IPaginationOptions,
  ): Promise<PublisherAffiliation[]> {
    return this.publisherAffiliationRepository.findByPublisherId(
      publisherId,
      paginationOptions,
    );
  }

  update(
    id: PublisherAffiliation['id'],
    updatePublisherAffiliationDto: UpdatePublisherAffiliationDto,
  ): Promise<PublisherAffiliation> {
    return this.publisherAffiliationRepository.update(
      id,
      updatePublisherAffiliationDto,
    );
  }

  remove(id: PublisherAffiliation['id']): Promise<void> {
    return this.publisherAffiliationRepository.softDelete(id);
  }
}
