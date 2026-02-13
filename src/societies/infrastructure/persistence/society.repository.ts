import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Society } from '../../domain/society';

export abstract class SocietyRepository {
  abstract create(
    data: Omit<Society, 'id' | 'createdAt' | 'updatedAt' | 'cwrSociety'>,
  ): Promise<Society>;

  abstract findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }): Promise<Society[]>;

  abstract findById(id: Society['id']): Promise<NullableType<Society>>;

  abstract findByCisacCode(
    cisacCode: Society['cisacCode'],
  ): Promise<NullableType<Society>>;

  abstract update(
    id: Society['id'],
    payload: DeepPartial<Society>,
  ): Promise<Society | null>;

  abstract remove(id: Society['id']): Promise<void>;
}
