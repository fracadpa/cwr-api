import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTerritoryDto } from './dto/create-territory.dto';
import { UpdateTerritoryDto } from './dto/update-territory.dto';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Territory } from './domain/territory';
import { TerritoryRepository } from './infrastructure/persistence/territory.repository';

@Injectable()
export class TerritoriesService {
  constructor(private readonly territoriesRepository: TerritoryRepository) {}

  async create(createTerritoryDto: CreateTerritoryDto): Promise<Territory> {
    // Validate tisCode uniqueness
    const existingByTisCode = await this.territoriesRepository.findByTisCode(
      createTerritoryDto.tisCode,
    );
    if (existingByTisCode) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { tisCode: 'tisCodeAlreadyExists' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newTerritory = new Territory();
    newTerritory.name = createTerritoryDto.name;
    newTerritory.tisCode = createTerritoryDto.tisCode;

    return await this.territoriesRepository.create(newTerritory);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.territoriesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Territory['id']) {
    return this.territoriesRepository.findById(id);
  }

  async update(
    id: Territory['id'],
    updateTerritoryDto: UpdateTerritoryDto,
  ): Promise<Territory | null> {
    const entity = await this.territoriesRepository.findById(id);

    if (!entity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: { id: 'territoryNotFound' },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate tisCode uniqueness if being updated
    if (
      updateTerritoryDto.tisCode &&
      updateTerritoryDto.tisCode !== entity.tisCode
    ) {
      const existingByTisCode = await this.territoriesRepository.findByTisCode(
        updateTerritoryDto.tisCode,
      );
      if (existingByTisCode && existingByTisCode.id !== id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { tisCode: 'tisCodeAlreadyExists' },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const payload: DeepPartial<Territory> = {};
    if (updateTerritoryDto.name !== undefined) {
      payload.name = updateTerritoryDto.name;
    }
    if (updateTerritoryDto.tisCode !== undefined) {
      payload.tisCode = updateTerritoryDto.tisCode;
    }

    return await this.territoriesRepository.update(id, payload);
  }

  remove(id: Territory['id']) {
    return this.territoriesRepository.remove(id);
  }
}
