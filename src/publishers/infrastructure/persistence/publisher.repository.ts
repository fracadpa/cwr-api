import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Publisher } from '../../domain/publisher';

export abstract class PublisherRepository {
  abstract create(
    data: Omit<Publisher, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Publisher>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Publisher[]>;

  abstract findById(id: Publisher['id']): Promise<NullableType<Publisher>>;

  abstract findByCode(
    code: Publisher['code'],
  ): Promise<NullableType<Publisher>>;

  abstract update(
    id: Publisher['id'],
    payload: DeepPartial<Publisher>,
  ): Promise<Publisher | null>;

  abstract remove(id: Publisher['id']): Promise<void>;
}
