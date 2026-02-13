import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantRepository } from './infrastructure/persistence/tenant.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Tenant } from './domain/tenants';
import { EntityManager } from 'typeorm'; // Changed from QueryRunner

@Injectable()
export class TenantsService {
  constructor(private readonly tenantsRepository: TenantRepository) {}

  async create(createTenantDto: CreateTenantDto, manager?: EntityManager) {
    // Changed QueryRunner to EntityManager
    // Transform createTenantDto to Tenant domain object
    const newTenant = new Tenant();
    newTenant.name = createTenantDto.name;
    // Assuming company is also passed as an object to createTenantDto or fetched here
    // For now, directly passing companyId, which will be handled in the repository mapper
    newTenant.company = { id: createTenantDto.companyId } as any;

    return this.tenantsRepository.create(newTenant, manager); // Passed manager
  }

  findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }) {
    return this.tenantsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
      search,
    });
  }

  findById(id: Tenant['id']) {
    return this.tenantsRepository.findById(id);
  }

  findByIds(ids: Tenant['id'][]) {
    return this.tenantsRepository.findByIds(ids);
  }

  async update(
    id: Tenant['id'],
    updateTenantDto: UpdateTenantDto,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ) {
    return this.tenantsRepository.update(id, updateTenantDto, manager); // Passed manager
  }

  remove(id: Tenant['id']) {
    return this.tenantsRepository.remove(id);
  }

  findByName(name: string, companyId: number) {
    return this.tenantsRepository.findByName(name, companyId);
  }
}
