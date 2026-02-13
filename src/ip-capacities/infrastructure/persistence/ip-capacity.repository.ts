import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { IpCapacity } from '../../domain/ip-capacity';

export abstract class IpCapacityRepository {
  abstract create(
    data: Omit<IpCapacity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IpCapacity>;

  abstract findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }): Promise<IpCapacity[]>;

  abstract findById(id: IpCapacity['id']): Promise<NullableType<IpCapacity>>;

  abstract findByCode(
    code: IpCapacity['code'],
  ): Promise<NullableType<IpCapacity>>;

  abstract update(
    id: IpCapacity['id'],
    payload: DeepPartial<IpCapacity>,
  ): Promise<IpCapacity | null>;

  abstract remove(id: IpCapacity['id']): Promise<void>;
}
