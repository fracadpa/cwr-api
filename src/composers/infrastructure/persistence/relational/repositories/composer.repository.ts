import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ComposerRepository } from '../../composer.repository';
import { Composer } from '../../../../domain/composer';
import { ComposerEntity } from '../entities/composer.entity';
import { ComposerMapper } from '../mappers/composer.mapper';
import { CreateComposerDto } from '../../../../dto/create-composer.dto';
import { UpdateComposerDto } from '../../../../dto/update-composer.dto';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { EntityCondition } from '@app/utils/types/entity-condition.type';
import { NullableType } from '@app/utils/types/nullable.type';
import { IpCapacityEntity } from '@app/ip-capacities/infrastructure/persistence/relational/entities/ip-capacity.entity';
import { CompanyEntity } from '@app/companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '@app/tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { applyTenantFilter } from '@app/database/utils/apply-tenant-filter';

@Injectable()
export class ComposerRelationalRepository implements ComposerRepository {
  constructor(
    @InjectRepository(ComposerEntity)
    private readonly composerRepository: Repository<ComposerEntity>,
    @InjectRepository(IpCapacityEntity)
    private readonly ipCapacityRepository: Repository<IpCapacityEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async create(createPayload: CreateComposerDto): Promise<Composer> {
    const ipCapacity = await this.ipCapacityRepository.findOne({
      where: { id: createPayload.ipCapacityId },
    });
    if (!ipCapacity) {
      throw new Error('IpCapacity not found');
    }

    const company = await this.companyRepository.findOne({
      where: { id: createPayload.companyId },
    });
    if (!company) {
      throw new Error('Company not found');
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id: createPayload.tenantId },
    });
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const entity = this.composerRepository.create({
      ...createPayload,
      ipCapacity,
      company,
      tenant,
    });

    const savedEntity = await this.composerRepository.save(entity);
    return ComposerMapper.toDomain(savedEntity);
  }

  async findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<Composer[]> {
    const where = applyTenantFilter<ComposerEntity>(
      {},
      { hasTenant: true, hasCompany: true },
    );

    const entities = await this.composerRepository.find({
      where,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
    return entities.map((entity) => ComposerMapper.toDomain(entity));
  }

  async findOne(
    fields: EntityCondition<Composer>,
  ): Promise<NullableType<Composer>> {
    const baseWhere = fields
      ? (fields as FindOptionsWhere<ComposerEntity>)
      : {};
    const where = applyTenantFilter<ComposerEntity>(baseWhere, {
      hasTenant: true,
      hasCompany: true,
    });

    const entity = await this.composerRepository.findOne({
      where,
    });

    return entity ? ComposerMapper.toDomain(entity) : null;
  }

  async update(
    id: Composer['id'],
    updatePayload: UpdateComposerDto,
  ): Promise<Composer> {
    const where = applyTenantFilter<ComposerEntity>(
      { id },
      { hasTenant: true, hasCompany: true },
    );

    const entity = await this.composerRepository.findOne({
      where,
    });

    if (!entity) {
      throw new Error('Composer not found');
    }

    if (updatePayload.ipCapacityId) {
      const ipCapacity = await this.ipCapacityRepository.findOne({
        where: { id: updatePayload.ipCapacityId },
      });
      if (!ipCapacity) {
        throw new Error('IpCapacity not found');
      }
      entity.ipCapacity = ipCapacity;
    }

    if (updatePayload.companyId) {
      const company = await this.companyRepository.findOne({
        where: { id: updatePayload.companyId },
      });
      if (!company) {
        throw new Error('Company not found');
      }
      entity.company = company;
    }

    if (updatePayload.tenantId) {
      const tenant = await this.tenantRepository.findOne({
        where: { id: updatePayload.tenantId },
      });
      if (!tenant) {
        throw new Error('Tenant not found');
      }
      entity.tenant = tenant;
    }

    const updatedEntity = await this.composerRepository.save({
      ...entity,
      ...updatePayload,
    });

    return ComposerMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Composer['id']): Promise<void> {
    const where = applyTenantFilter<ComposerEntity>(
      { id },
      { hasTenant: true, hasCompany: true },
    );

    await this.composerRepository.softDelete(where);
  }
}
