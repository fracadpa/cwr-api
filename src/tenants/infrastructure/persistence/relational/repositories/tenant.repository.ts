import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm'; // Changed QueryRunner to EntityManager
import { TenantEntity } from '../entities/tenant.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Tenant } from '../../../../domain/tenants';
import { TenantRepository } from '../../tenant.repository';
import { TenantMapper } from '../mappers/tenant.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TenantRelationalRepository implements TenantRepository {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantsRepository: Repository<TenantEntity>,
  ) {}

  async create(data: Tenant, manager?: EntityManager): Promise<Tenant> {
    // Changed queryRunner to manager
    const persistenceModel = TenantMapper.toPersistence(data);
    const entityToSave = this.tenantsRepository.create(persistenceModel);
    let newEntity: TenantEntity;
    if (manager) {
      newEntity = await manager.save(TenantEntity, entityToSave);
    } else {
      newEntity = await this.tenantsRepository.save(entityToSave);
    }
    return TenantMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }): Promise<Tenant[]> {
    const queryBuilder = this.tenantsRepository.createQueryBuilder('tenant');

    if (search) {
      const escapedSearch = this.escapeSearchTerm(search);
      queryBuilder.where('tenant.name ILIKE :search', {
        search: `%${escapedSearch}%`,
      });
    }

    const entities = await queryBuilder
      .orderBy('tenant.name', 'ASC')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getMany();

    return entities.map((entity) => TenantMapper.toDomain(entity));
  }

  private escapeSearchTerm(term: string): string {
    return term
      .replace(/\\/g, '\\\\')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_');
  }

  async findById(id: Tenant['id']): Promise<NullableType<Tenant>> {
    const entity = await this.tenantsRepository.findOne({
      where: { id },
    });

    return entity ? TenantMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Tenant['id'][]): Promise<Tenant[]> {
    const entities = await this.tenantsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TenantMapper.toDomain(entity));
  }

  async update(
    id: Tenant['id'],
    payload: Partial<Tenant>,
    manager?: EntityManager, // Changed queryRunner to manager
  ): Promise<Tenant> {
    const entity = await this.tenantsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityToUpdate = this.tenantsRepository.create(
      // Declare only once
      TenantMapper.toPersistence({
        ...TenantMapper.toDomain(entity),
        ...payload,
      }),
    );

    let updatedEntity: TenantEntity;
    if (manager) {
      updatedEntity = await manager.save(TenantEntity, entityToUpdate);
    } else {
      updatedEntity = await this.tenantsRepository.save(entityToUpdate);
    }

    return TenantMapper.toDomain(updatedEntity);
  }

  async remove(id: Tenant['id']): Promise<void> {
    await this.tenantsRepository.delete(id);
  }

  async findByName(
    name: string,
    companyId: number,
  ): Promise<NullableType<Tenant>> {
    const entity = await this.tenantsRepository.findOne({
      where: { name, company: { id: companyId } },
      relations: ['company'],
    });
    return entity ? TenantMapper.toDomain(entity) : null;
  }
}
