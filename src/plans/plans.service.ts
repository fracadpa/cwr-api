import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanRepository } from './infrastructure/persistence/plan.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Plan } from './domain/plans';
import { EntityManager } from 'typeorm'; // Changed from QueryRunner

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlanRepository) {}

  async create(createPlanDto: CreatePlanDto, manager?: EntityManager) {
    // Changed QueryRunner to EntityManager
    return this.plansRepository.create(createPlanDto, manager); // Passed manager
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.plansRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Plan['id'], manager?: EntityManager) {
    return this.plansRepository.findById(id, manager);
  }

  findByIds(ids: Plan['id'][]) {
    return this.plansRepository.findByIds(ids);
  }

  async update(
    id: Plan['id'],
    updatePlanDto: UpdatePlanDto,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ) {
    return this.plansRepository.update(id, updatePlanDto, manager); // Passed manager
  }

  remove(id: Plan['id']) {
    return this.plansRepository.remove(id);
  }

  async findDefaultPlan(manager?: EntityManager) {
    // Changed QueryRunner to EntityManager
    return this.plansRepository.findDefaultPlan(manager); // Passed manager
  }
}
