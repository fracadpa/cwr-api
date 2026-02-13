import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IpCapacityEntity } from '../entities/ip-capacity.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IpCapacity } from '../../../../domain/ip-capacity';
import { IpCapacityRepository } from '../../ip-capacity.repository';
import { IpCapacityMapper } from '../mappers/ip-capacity.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class IpCapacityRelationalRepository implements IpCapacityRepository {
  constructor(
    @InjectRepository(IpCapacityEntity)
    private readonly ipCapacitiesRepository: Repository<IpCapacityEntity>,
  ) {}

  async create(data: IpCapacity): Promise<IpCapacity> {
    const persistenceModel = IpCapacityMapper.toPersistence(data);
    const entityToSave = this.ipCapacitiesRepository.create(persistenceModel);
    const newEntity = await this.ipCapacitiesRepository.save(entityToSave);
    return IpCapacityMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }): Promise<IpCapacity[]> {
    const queryBuilder =
      this.ipCapacitiesRepository.createQueryBuilder('ipCapacity');

    if (search) {
      const escapedSearch = this.escapeSearchTerm(search);
      queryBuilder.where(
        '(ipCapacity.name ILIKE :search OR ipCapacity.code ILIKE :search)',
        { search: `%${escapedSearch}%` },
      );
    }

    const entities = await queryBuilder
      .orderBy('ipCapacity.name', 'ASC')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getMany();

    return entities.map((entity) => IpCapacityMapper.toDomain(entity));
  }

  private escapeSearchTerm(term: string): string {
    return term
      .replace(/\\/g, '\\\\')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_');
  }

  async findById(id: IpCapacity['id']): Promise<NullableType<IpCapacity>> {
    const entity = await this.ipCapacitiesRepository.findOne({
      where: { id },
    });

    return entity ? IpCapacityMapper.toDomain(entity) : null;
  }

  async findByCode(
    code: IpCapacity['code'],
  ): Promise<NullableType<IpCapacity>> {
    const entity = await this.ipCapacitiesRepository.findOne({
      where: { code },
    });

    return entity ? IpCapacityMapper.toDomain(entity) : null;
  }

  async update(
    id: IpCapacity['id'],
    payload: Partial<IpCapacity>,
  ): Promise<IpCapacity> {
    const entity = await this.ipCapacitiesRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityToUpdate = this.ipCapacitiesRepository.create(
      IpCapacityMapper.toPersistence({
        ...IpCapacityMapper.toDomain(entity),
        ...payload,
      }),
    );

    const updatedEntity =
      await this.ipCapacitiesRepository.save(entityToUpdate);

    return IpCapacityMapper.toDomain(updatedEntity);
  }

  async remove(id: IpCapacity['id']): Promise<void> {
    await this.ipCapacitiesRepository.delete(id);
  }
}
