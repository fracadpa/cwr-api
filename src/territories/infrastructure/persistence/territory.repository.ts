import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Territory } from '../../domain/territory';

export abstract class TerritoryRepository {
  abstract create(
    data: Omit<Territory, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Territory>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Territory[]>;

  abstract findById(id: Territory['id']): Promise<NullableType<Territory>>;

  abstract findByTisCode(
    tisCode: Territory['tisCode'],
  ): Promise<NullableType<Territory>>;

  abstract update(
    id: Territory['id'],
    payload: DeepPartial<Territory>,
  ): Promise<Territory | null>;

  abstract remove(id: Territory['id']): Promise<void>;
}
