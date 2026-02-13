import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublisherEntity } from '../entities/publisher.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Publisher } from '../../../../domain/publisher';
import { PublisherRepository } from '../../publisher.repository';
import { PublisherMapper } from '../mappers/publisher.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { applyTenantFilter } from '@app/database/utils/apply-tenant-filter';

@Injectable()
export class PublisherRelationalRepository implements PublisherRepository {
  constructor(
    @InjectRepository(PublisherEntity)
    private readonly publishersRepository: Repository<PublisherEntity>,
  ) {}

  async create(data: Publisher): Promise<Publisher> {
    const persistenceModel = PublisherMapper.toPersistence(data);
    const entityToSave = this.publishersRepository.create(persistenceModel);
    const newEntity = await this.publishersRepository.save(entityToSave);
    return PublisherMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Publisher[]> {
    const where = applyTenantFilter<PublisherEntity>(
      {},
      { hasTenant: true, hasCompany: true },
    );

    const entities = await this.publishersRepository.find({
      where,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['ipCapacity', 'company', 'tenant'],
    });

    return entities.map((entity) => PublisherMapper.toDomain(entity));
  }

  async findById(id: Publisher['id']): Promise<NullableType<Publisher>> {
    const where = applyTenantFilter<PublisherEntity>(
      { id },
      { hasTenant: true, hasCompany: true },
    );

    const entity = await this.publishersRepository.findOne({
      where,
      relations: ['ipCapacity', 'company', 'tenant'],
    });

    return entity ? PublisherMapper.toDomain(entity) : null;
  }

  async findByCode(code: Publisher['code']): Promise<NullableType<Publisher>> {
    const where = applyTenantFilter<PublisherEntity>(
      { code },
      { hasTenant: true, hasCompany: true },
    );

    const entity = await this.publishersRepository.findOne({
      where,
      relations: ['ipCapacity', 'company', 'tenant'],
    });

    return entity ? PublisherMapper.toDomain(entity) : null;
  }

  async update(
    id: Publisher['id'],
    payload: Partial<Publisher>,
  ): Promise<Publisher> {
    const where = applyTenantFilter<PublisherEntity>(
      { id },
      { hasTenant: true, hasCompany: true },
    );

    const entity = await this.publishersRepository.findOne({
      where,
      relations: ['ipCapacity', 'company', 'tenant'],
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityToUpdate = this.publishersRepository.create(
      PublisherMapper.toPersistence({
        ...PublisherMapper.toDomain(entity),
        ...payload,
      }),
    );

    const updatedEntity = await this.publishersRepository.save(entityToUpdate);

    return PublisherMapper.toDomain(updatedEntity);
  }

  async remove(id: Publisher['id']): Promise<void> {
    const where = applyTenantFilter<PublisherEntity>(
      { id },
      { hasTenant: true, hasCompany: true },
    );

    await this.publishersRepository.delete(where);
  }
}
