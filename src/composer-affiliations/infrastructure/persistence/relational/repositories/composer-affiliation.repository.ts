import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ComposerAffiliationRepository } from '@app/composer-affiliations/infrastructure/persistence/composer-affiliation.repository';
import { ComposerAffiliation } from '@app/composer-affiliations/domain/composer-affiliation';
import { ComposerAffiliationEntity } from '../entities/composer-affiliation.entity';
import { ComposerAffiliationMapper } from '../mappers/composer-affiliation.mapper';
import { CreateComposerAffiliationDto } from '@app/composer-affiliations/dto/create-composer-affiliation.dto';
import { UpdateComposerAffiliationDto } from '@app/composer-affiliations/dto/update-composer-affiliation.dto';
import { IPaginationOptions } from '@app/utils/types/pagination-options';
import { EntityCondition } from '@app/utils/types/entity-condition.type';
import { NullableType } from '@app/utils/types/nullable.type';
import { ComposerEntity } from '@app/composers/infrastructure/persistence/relational/entities/composer.entity';
import { SocietyEntity } from '@app/societies/infrastructure/persistence/relational/entities/society.entity';
import { CompanyEntity } from '@app/companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '@app/tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { applyTenantFilter } from '@app/database/utils/apply-tenant-filter';

@Injectable()
export class ComposerAffiliationRelationalRepository
  implements ComposerAffiliationRepository
{
  constructor(
    @InjectRepository(ComposerAffiliationEntity)
    private readonly composerAffiliationRepository: Repository<ComposerAffiliationEntity>,
    @InjectRepository(ComposerEntity)
    private readonly composerRepository: Repository<ComposerEntity>,
    @InjectRepository(SocietyEntity)
    private readonly societyRepository: Repository<SocietyEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async create(
    createPayload: CreateComposerAffiliationDto,
  ): Promise<ComposerAffiliation> {
    const composer = await this.composerRepository.findOne({
      where: { id: createPayload.composerId },
    });
    if (!composer) {
      throw new Error('Composer not found');
    }

    const publicSociety = await this.societyRepository.findOne({
      where: { id: createPayload.publicSocietyId },
    });
    if (!publicSociety) {
      throw new Error('Public Society not found');
    }

    const mechanicalSociety = await this.societyRepository.findOne({
      where: { id: createPayload.mechanicalSocietyId },
    });
    if (!mechanicalSociety) {
      throw new Error('Mechanical Society not found');
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

    const entity = this.composerAffiliationRepository.create({
      composer,
      publicSociety,
      mechanicalSociety,
      company,
      tenant,
    });

    const savedEntity = await this.composerAffiliationRepository.save(entity);
    return ComposerAffiliationMapper.toDomain(savedEntity);
  }

  async findManyWithPagination(
    paginationOptions: IPaginationOptions,
    filterOptions?: { composerId?: number | null },
  ): Promise<ComposerAffiliation[]> {
    const baseWhere: FindOptionsWhere<ComposerAffiliationEntity> = {};
    if (filterOptions?.composerId) {
      baseWhere.composer = {
        id: filterOptions.composerId,
      };
    }

    const where = applyTenantFilter<ComposerAffiliationEntity>(baseWhere, {
      hasTenant: true,
      hasCompany: true,
    });

    const entities = await this.composerAffiliationRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
    });
    return entities.map((entity) => ComposerAffiliationMapper.toDomain(entity));
  }

  async findOne(
    fields: EntityCondition<ComposerAffiliation>,
  ): Promise<NullableType<ComposerAffiliation>> {
    const baseWhere = fields
      ? (fields as FindOptionsWhere<ComposerAffiliationEntity>)
      : {};
    const where = applyTenantFilter<ComposerAffiliationEntity>(baseWhere, {
      hasTenant: true,
      hasCompany: true,
    });

    const entity = await this.composerAffiliationRepository.findOne({
      where,
    });

    return entity ? ComposerAffiliationMapper.toDomain(entity) : null;
  }

  async update(
    id: ComposerAffiliation['id'],
    updatePayload: UpdateComposerAffiliationDto,
  ): Promise<ComposerAffiliation> {
    const where = applyTenantFilter<ComposerAffiliationEntity>(
      { id },
      { hasTenant: true, hasCompany: true },
    );

    const entity = await this.composerAffiliationRepository.findOne({
      where,
    });

    if (!entity) {
      throw new Error('Composer Affiliation not found');
    }

    if (updatePayload.composerId) {
      const composer = await this.composerRepository.findOne({
        where: { id: updatePayload.composerId },
      });
      if (!composer) {
        throw new Error('Composer not found');
      }
      entity.composer = composer;
    }

    if (updatePayload.publicSocietyId) {
      const publicSociety = await this.societyRepository.findOne({
        where: { id: updatePayload.publicSocietyId },
      });
      if (!publicSociety) {
        throw new Error('Public Society not found');
      }
      entity.publicSociety = publicSociety;
    }

    if (updatePayload.mechanicalSocietyId) {
      const mechanicalSociety = await this.societyRepository.findOne({
        where: { id: updatePayload.mechanicalSocietyId },
      });
      if (!mechanicalSociety) {
        throw new Error('Mechanical Society not found');
      }
      entity.mechanicalSociety = mechanicalSociety;
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

    const updatedEntity = await this.composerAffiliationRepository.save(entity);
    return ComposerAffiliationMapper.toDomain(updatedEntity);
  }

  async softDelete(id: ComposerAffiliation['id']): Promise<void> {
    const where = applyTenantFilter<ComposerAffiliationEntity>(
      { id },
      { hasTenant: true, hasCompany: true },
    );

    await this.composerAffiliationRepository.delete(where);
  }
}
