import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Company } from '../../domain/companies';
import { EntityManager } from 'typeorm'; // Changed from QueryRunner

export abstract class CompanyRepository {
  abstract create(
    data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ): Promise<Company>;

  abstract findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }): Promise<Company[]>;

  abstract findById(
    id: Company['id'],
    manager?: EntityManager,
  ): Promise<NullableType<Company>>;

  abstract findByIds(ids: Company['id'][]): Promise<Company[]>;

  abstract update(
    id: Company['id'],
    payload: DeepPartial<Company>,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ): Promise<Company | null>;

  abstract remove(id: Company['id']): Promise<void>;

  abstract findByName(
    name: string,
    manager?: EntityManager,
  ): Promise<NullableType<Company>>;
}
