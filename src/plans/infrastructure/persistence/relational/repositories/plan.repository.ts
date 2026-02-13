import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm'; // Changed QueryRunner to EntityManager
import { PlanEntity } from '../entities/plan.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Plan } from '../../../../domain/plans';
import { PlanRepository } from '../../plan.repository';
import { PlanMapper } from '../mappers/plan.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PlanRelationalRepository implements PlanRepository {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly plansRepository: Repository<PlanEntity>,
  ) {}

  async create(data: Plan, manager?: EntityManager): Promise<Plan> {
    const persistenceModel = PlanMapper.toPersistence(data);
    const entityToSave = this.plansRepository.create(persistenceModel);
    let newEntity: PlanEntity;
    if (manager) {
      newEntity = await manager.save(PlanEntity, entityToSave);
    } else {
      newEntity = await this.plansRepository.save(entityToSave);
    }
    return PlanMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Plan[]> {
    const entities = await this.plansRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PlanMapper.toDomain(entity));
  }

  async findById(
    id: Plan['id'],
    manager?: EntityManager,
  ): Promise<NullableType<Plan>> {
    const repository = manager
      ? manager.getRepository(PlanEntity)
      : this.plansRepository;

    const entity = await repository.findOne({
      where: { id },
    });

    return entity ? PlanMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Plan['id'][]): Promise<Plan[]> {
    const entities = await this.plansRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => PlanMapper.toDomain(entity));
  }

  async findDefaultPlan(manager?: EntityManager): Promise<NullableType<Plan>> {
    const entity = await (manager
      ? manager.findOne(PlanEntity, { where: { name: 'Free' } })
      : this.plansRepository.findOne({
          where: { name: 'Free' }, // Assuming 'Free' is the default plan name
        }));

    return entity ? PlanMapper.toDomain(entity) : null;
  }

  async update(
    id: Plan['id'],
    payload: Partial<Plan>,
    manager?: EntityManager, // Changed queryRunner to manager
  ): Promise<Plan> {
    const entity = await this.plansRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityToUpdate = this.plansRepository.create(
      PlanMapper.toPersistence({
        ...PlanMapper.toDomain(entity),
        ...payload,
      }),
    );

    let updatedEntity: PlanEntity;
    if (manager) {
      updatedEntity = await manager.save(PlanEntity, entityToUpdate);
    } else {
      updatedEntity = await this.plansRepository.save(entityToUpdate);
    }

    return PlanMapper.toDomain(updatedEntity);
  }

  async remove(id: Plan['id']): Promise<void> {
    await this.plansRepository.delete(id);
  }
}
