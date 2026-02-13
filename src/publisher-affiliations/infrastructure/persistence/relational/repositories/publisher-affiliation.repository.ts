import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PublisherAffiliationRepository } from '@app/publisher-affiliations/infrastructure/persistence/publisher-affiliation.repository';
import { PublisherAffiliation } from '@app/publisher-affiliations/domain/publisher-affiliation';
import { PublisherAffiliationEntity } from '@app/publisher-affiliations/infrastructure/persistence/relational/entities/publisher-affiliation.entity';
import { PublisherAffiliationMapper } from '@app/publisher-affiliations/infrastructure/persistence/relational/mappers/publisher-affiliation.mapper';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { CreatePublisherAffiliationDto } from '@app/publisher-affiliations/dto/create-publisher-affiliation.dto';
import { UpdatePublisherAffiliationDto } from '@app/publisher-affiliations/dto/update-publisher-affiliation.dto';
import { PublisherEntity } from '@app/publishers/infrastructure/persistence/relational/entities/publisher.entity';
import { SocietyEntity } from '@app/societies/infrastructure/persistence/relational/entities/society.entity';
import { EntityCondition } from '@app/utils/types/entity-condition.type';
import { NullableType } from '@app/utils/types/nullable.type';
import { applyTenantFilter } from '@app/database/utils/apply-tenant-filter';

@Injectable()
export class PublisherAffiliationRelationalRepository
  implements PublisherAffiliationRepository
{
  constructor(
    @InjectRepository(PublisherAffiliationEntity)
    private readonly publisherAffiliationRepository: Repository<PublisherAffiliationEntity>,
    @InjectRepository(PublisherEntity)
    private readonly publisherRepository: Repository<PublisherEntity>,
    @InjectRepository(SocietyEntity)
    private readonly societyRepository: Repository<SocietyEntity>,
  ) {}

  async create(
    createPayload: CreatePublisherAffiliationDto,
  ): Promise<PublisherAffiliation> {
    const publisher = await this.publisherRepository.findOne({
      where: { id: createPayload.publisherId },
    });
    if (!publisher) {
      // Handle error: Publisher not found
      throw new Error('Publisher not found');
    }

    const publicSociety = await this.societyRepository.findOne({
      where: { id: createPayload.publicSocietyId },
    });
    if (!publicSociety) {
      // Handle error: Public Society not found
      throw new Error('Public Society not found');
    }

    const mechanicalSociety = await this.societyRepository.findOne({
      where: { id: createPayload.mechanicalSocietyId },
    });
    if (!mechanicalSociety) {
      // Handle error: Mechanical Society not found
      throw new Error('Mechanical Society not found');
    }

    const entity = this.publisherAffiliationRepository.create({
      publisher,
      publicSociety,
      mechanicalSociety,
    });

    const savedEntity = await this.publisherAffiliationRepository.save(entity);
    return PublisherAffiliationMapper.toDomain(savedEntity);
  }

  async findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<PublisherAffiliation[]> {
    const where = applyTenantFilter<PublisherAffiliationEntity>(
      {},
      { hasTenant: true, hasCompany: true },
    );

    const entities = await this.publisherAffiliationRepository.find({
      where,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
    return entities.map((entity) =>
      PublisherAffiliationMapper.toDomain(entity),
    );
  }

  async findOne(
    fields: EntityCondition<PublisherAffiliation>,
  ): Promise<NullableType<PublisherAffiliation>> {
    const baseWhere = fields
      ? (fields as FindOptionsWhere<PublisherAffiliationEntity>)
      : {};
    const where = applyTenantFilter<PublisherAffiliationEntity>(baseWhere, {
      hasTenant: true,
      hasCompany: true,
    });

    const entity = await this.publisherAffiliationRepository.findOne({
      where,
    });

    if (!entity) {
      return null;
    }

    return PublisherAffiliationMapper.toDomain(entity);
  }

  async findByPublisherId(
    publisherId: number,
    paginationOptions: IPaginationOptions,
  ): Promise<PublisherAffiliation[]> {
    const where = applyTenantFilter<PublisherAffiliationEntity>(
      { publisher: { id: publisherId } },
      { hasTenant: true, hasCompany: true },
    );

    const entities = await this.publisherAffiliationRepository.find({
      where,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) =>
      PublisherAffiliationMapper.toDomain(entity),
    );
  }

  async update(
    id: PublisherAffiliation['id'],
    updatePayload: UpdatePublisherAffiliationDto,
  ): Promise<PublisherAffiliation> {
    const where = applyTenantFilter<PublisherAffiliationEntity>(
      { id },
      { hasTenant: true, hasCompany: true },
    );

    const entity = await this.publisherAffiliationRepository.findOne({
      where,
    });

    if (!entity) {
      throw new Error('Publisher Affiliation not found');
    }

    if (updatePayload.publisherId) {
      const publisher = await this.publisherRepository.findOne({
        where: { id: updatePayload.publisherId },
      });
      if (!publisher) {
        throw new Error('Publisher not found');
      }
      entity.publisher = publisher;
    }

    if (updatePayload.publicSocietyId) {
      const publicSociety = await this.societyRepository.findOne({
        where: { id: updatePayload.publicSocietyId },
      });
      if (!publicSociety) {
        throw new Error('Public Society not found');
      }
      entity.publicSociety = publicSociety;
    }

    if (updatePayload.mechanicalSocietyId) {
      const mechanicalSociety = await this.societyRepository.findOne({
        where: { id: updatePayload.mechanicalSocietyId },
      });
      if (!mechanicalSociety) {
        throw new Error('Mechanical Society not found');
      }
      entity.mechanicalSociety = mechanicalSociety;
    }

    const updatedEntity =
      await this.publisherAffiliationRepository.save(entity);
    return PublisherAffiliationMapper.toDomain(updatedEntity);
  }

  async softDelete(id: PublisherAffiliation['id']): Promise<void> {
    const where = applyTenantFilter<PublisherAffiliationEntity>(
      { id },
      { hasTenant: true, hasCompany: true },
    );

    await this.publisherAffiliationRepository.delete(where);
  }
}
