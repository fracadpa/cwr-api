import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Tenant } from '../../domain/tenants';
import { EntityManager } from 'typeorm'; // Changed from QueryRunner

export abstract class TenantRepository {
  abstract create(
    data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ): Promise<Tenant>;

  abstract findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }): Promise<Tenant[]>;

  abstract findById(id: Tenant['id']): Promise<NullableType<Tenant>>;

  abstract findByIds(ids: Tenant['id'][]): Promise<Tenant[]>;

  abstract update(
    id: Tenant['id'],
    payload: DeepPartial<Tenant>,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ): Promise<Tenant | null>;

  abstract remove(id: Tenant['id']): Promise<void>;

  abstract findByName(
    name: string,
    companyId: number,
  ): Promise<NullableType<Tenant>>;
}
