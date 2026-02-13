import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm'; // Changed QueryRunner to EntityManager
import { CompanyEntity } from '../entities/company.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Company } from '../../../../domain/companies';
import { CompanyRepository } from '../../company.repository';
import { CompanyMapper } from '../mappers/company.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CompanyRelationalRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companiesRepository: Repository<CompanyEntity>,
  ) {}

  async create(data: Company, manager?: EntityManager): Promise<Company> {
    // Changed queryRunner to manager
    const persistenceModel = CompanyMapper.toPersistence(data);
    const entityToSave = this.companiesRepository.create(persistenceModel); // First create the entity

    let newEntity: CompanyEntity;
    if (manager) {
      newEntity = await manager.save(CompanyEntity, entityToSave);
    } else {
      newEntity = await this.companiesRepository.save(entityToSave);
    }
    return CompanyMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }): Promise<Company[]> {
    const queryBuilder = this.companiesRepository.createQueryBuilder('company');

    if (search) {
      const escapedSearch = this.escapeSearchTerm(search);
      queryBuilder.where('company.name ILIKE :search', {
        search: `%${escapedSearch}%`,
      });
    }

    const entities = await queryBuilder
      .orderBy('company.name', 'ASC')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getMany();

    return entities.map((entity) => CompanyMapper.toDomain(entity));
  }

  private escapeSearchTerm(term: string): string {
    return term
      .replace(/\\/g, '\\\\')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_');
  }

  async findById(
    id: Company['id'],
    manager?: EntityManager,
  ): Promise<NullableType<Company>> {
    const repository = manager
      ? manager.getRepository(CompanyEntity)
      : this.companiesRepository;

    const entity = await repository.findOne({
      where: { id },
    });

    return entity ? CompanyMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Company['id'][]): Promise<Company[]> {
    const entities = await this.companiesRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => CompanyMapper.toDomain(entity));
  }

  async update(
    id: Company['id'],
    payload: Partial<Company>,
    manager?: EntityManager, // Changed queryRunner to manager
  ): Promise<Company> {
    const repository = manager
      ? manager.getRepository(CompanyEntity)
      : this.companiesRepository;
    const entity = await repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityToUpdate = repository.create(
      // Declare only once
      CompanyMapper.toPersistence({
        ...CompanyMapper.toDomain(entity),
        ...payload,
      }),
    );

    const updatedEntity = await repository.save(entityToUpdate);

    return CompanyMapper.toDomain(updatedEntity);
  }

  async remove(id: Company['id']): Promise<void> {
    await this.companiesRepository.delete(id);
  }

  async findByName(
    name: string,
    manager?: EntityManager,
  ): Promise<NullableType<Company>> {
    const repository = manager
      ? manager.getRepository(CompanyEntity)
      : this.companiesRepository;
    const entity = await repository.findOne({ where: { name } });
    return entity ? CompanyMapper.toDomain(entity) : null;
  }
}
