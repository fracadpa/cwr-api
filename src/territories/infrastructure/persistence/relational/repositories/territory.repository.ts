import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TerritoryEntity } from '../entities/territory.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Territory } from '../../../../domain/territory';
import { TerritoryRepository } from '../../territory.repository';
import { TerritoryMapper } from '../mappers/territory.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TerritoryRelationalRepository implements TerritoryRepository {
  constructor(
    @InjectRepository(TerritoryEntity)
    private readonly territoriesRepository: Repository<TerritoryEntity>,
  ) {}

  async create(data: Territory): Promise<Territory> {
    const persistenceModel = TerritoryMapper.toPersistence(data);
    const entityToSave = this.territoriesRepository.create(persistenceModel);
    const newEntity = await this.territoriesRepository.save(entityToSave);
    return TerritoryMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Territory[]> {
    const entities = await this.territoriesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TerritoryMapper.toDomain(entity));
  }

  async findById(id: Territory['id']): Promise<NullableType<Territory>> {
    const entity = await this.territoriesRepository.findOne({
      where: { id },
    });

    return entity ? TerritoryMapper.toDomain(entity) : null;
  }

  async findByTisCode(
    tisCode: Territory['tisCode'],
  ): Promise<NullableType<Territory>> {
    const entity = await this.territoriesRepository.findOne({
      where: { tisCode },
    });

    return entity ? TerritoryMapper.toDomain(entity) : null;
  }

  async update(
    id: Territory['id'],
    payload: Partial<Territory>,
  ): Promise<Territory> {
    const entity = await this.territoriesRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityToUpdate = this.territoriesRepository.create(
      TerritoryMapper.toPersistence({
        ...TerritoryMapper.toDomain(entity),
        ...payload,
      }),
    );

    const updatedEntity = await this.territoriesRepository.save(entityToUpdate);

    return TerritoryMapper.toDomain(updatedEntity);
  }

  async remove(id: Territory['id']): Promise<void> {
    await this.territoriesRepository.delete(id);
  }
}
