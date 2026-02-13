import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Artwork } from '../../domain/artwork';
import { EntityManager } from 'typeorm';

export abstract class ArtworkRepository {
  abstract create(
    data: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>,
    manager?: EntityManager,
  ): Promise<Artwork>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Artwork[]>;

  abstract findById(
    id: Artwork['id'],
    manager?: EntityManager,
  ): Promise<NullableType<Artwork>>;

  abstract update(
    id: Artwork['id'],
    payload: DeepPartial<Artwork>,
    manager?: EntityManager,
  ): Promise<Artwork | null>;

  abstract remove(id: Artwork['id']): Promise<void>;
}
