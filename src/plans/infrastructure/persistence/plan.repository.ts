import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Plan } from '../../domain/plans';
import { EntityManager } from 'typeorm'; // Changed from QueryRunner

export abstract class PlanRepository {
  abstract create(
    data: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ): Promise<Plan>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Plan[]>;

  abstract findById(
    id: Plan['id'],
    manager?: EntityManager,
  ): Promise<NullableType<Plan>>;

  abstract findByIds(ids: Plan['id'][]): Promise<Plan[]>;

  abstract findDefaultPlan(
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ): Promise<NullableType<Plan>>;

  abstract update(
    id: Plan['id'],
    payload: DeepPartial<Plan>,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ): Promise<Plan | null>;

  abstract remove(id: Plan['id']): Promise<void>;
}
