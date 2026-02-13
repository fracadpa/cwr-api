import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Subscription } from '../../domain/subscriptions';
import { Company } from '../../../companies/domain/companies';
import { EntityManager } from 'typeorm'; // Changed from QueryRunner

export abstract class SubscriptionRepository {
  abstract create(
    data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ): Promise<Subscription>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Subscription[]>;

  abstract findAllByCompanyIdWithPagination({
    companyId,
    paginationOptions,
  }: {
    companyId: Company['id'];
    paginationOptions: IPaginationOptions;
  }): Promise<Subscription[]>;

  abstract findById(
    id: Subscription['id'],
  ): Promise<NullableType<Subscription>>;

  abstract findByIds(ids: Subscription['id'][]): Promise<Subscription[]>;

  abstract findActiveSubscriptionByCompanyId(
    id: Company['id'],
    manager?: EntityManager,
  ): Promise<NullableType<Subscription>>;

  abstract update(
    id: Subscription['id'],
    payload: DeepPartial<Subscription>,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ): Promise<Subscription | null>;

  abstract remove(id: Subscription['id']): Promise<void>;
}
