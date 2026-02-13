import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm'; // Changed QueryRunner to EntityManager
import { SubscriptionEntity } from '../entities/subscription.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Subscription } from '../../../../domain/subscriptions';
import { SubscriptionRepository } from '../../subscription.repository';
import { SubscriptionMapper } from '../mappers/subscription.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Company } from '../../../../../companies/domain/companies';
import { SubscriptionStatusEnum } from '../../../../domain/subscription-status.enum';

@Injectable()
export class SubscriptionRelationalRepository
  implements SubscriptionRepository
{
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionsRepository: Repository<SubscriptionEntity>,
  ) {}

  async create(
    data: Subscription,
    manager?: EntityManager,
  ): Promise<Subscription> {
    // Changed queryRunner to manager
    const persistenceModel = SubscriptionMapper.toPersistence(data);
    const entityToSave = this.subscriptionsRepository.create(persistenceModel);
    let newEntity: SubscriptionEntity;
    if (manager) {
      newEntity = await manager.save(SubscriptionEntity, entityToSave);
    } else {
      newEntity = await this.subscriptionsRepository.save(entityToSave);
    }
    return SubscriptionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Subscription[]> {
    const entities = await this.subscriptionsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => SubscriptionMapper.toDomain(entity));
  }

  async findAllByCompanyIdWithPagination({
    companyId,
    paginationOptions,
  }: {
    companyId: Company['id'];
    paginationOptions: IPaginationOptions;
  }): Promise<Subscription[]> {
    const entities = await this.subscriptionsRepository.find({
      where: {
        company: {
          id: companyId,
        },
      },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['company'], // Eager load company
    });

    return entities.map((entity) => SubscriptionMapper.toDomain(entity));
  }

  async findById(id: Subscription['id']): Promise<NullableType<Subscription>> {
    const entity = await this.subscriptionsRepository.findOne({
      where: { id },
    });

    return entity ? SubscriptionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Subscription['id'][]): Promise<Subscription[]> {
    const entities = await this.subscriptionsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => SubscriptionMapper.toDomain(entity));
  }

  async findActiveSubscriptionByCompanyId(
    id: Company['id'],
    manager?: EntityManager,
  ): Promise<NullableType<Subscription>> {
    const repository = manager
      ? manager.getRepository(SubscriptionEntity)
      : this.subscriptionsRepository;

    const entity = await repository.findOne({
      where: {
        company: {
          id,
        },
        status: SubscriptionStatusEnum.ACTIVE,
      },
    });

    return entity ? SubscriptionMapper.toDomain(entity) : null;
  }

  async update(
    id: Subscription['id'],
    payload: Partial<Subscription>,
    manager?: EntityManager, // Changed queryRunner to manager
  ): Promise<Subscription> {
    const entity = await this.subscriptionsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityToUpdate = this.subscriptionsRepository.create(
      SubscriptionMapper.toPersistence({
        ...SubscriptionMapper.toDomain(entity),
        ...payload,
      }),
    );

    let updatedEntity: SubscriptionEntity;
    if (manager) {
      updatedEntity = await manager.save(SubscriptionEntity, entityToUpdate);
    } else {
      updatedEntity = await this.subscriptionsRepository.save(entityToUpdate);
    }

    return SubscriptionMapper.toDomain(updatedEntity);
  }

  async remove(id: Subscription['id']): Promise<void> {
    await this.subscriptionsRepository.delete(id);
  }
}
