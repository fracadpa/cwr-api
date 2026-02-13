import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateIpCapacityDto } from './dto/create-ip-capacity.dto';
import { UpdateIpCapacityDto } from './dto/update-ip-capacity.dto';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { IpCapacity } from './domain/ip-capacity';
import { IpCapacityRepository } from './infrastructure/persistence/ip-capacity.repository';

@Injectable()
export class IpCapacitiesService {
  constructor(private readonly ipCapacitiesRepository: IpCapacityRepository) {}

  async create(createIpCapacityDto: CreateIpCapacityDto): Promise<IpCapacity> {
    // Validate code uniqueness
    const existingByCode = await this.ipCapacitiesRepository.findByCode(
      createIpCapacityDto.code,
    );
    if (existingByCode) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { code: 'codeAlreadyExists' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newIpCapacity = new IpCapacity();
    newIpCapacity.name = createIpCapacityDto.name;
    newIpCapacity.code = createIpCapacityDto.code;
    newIpCapacity.cwrCapacity = createIpCapacityDto.cwrCapacity;

    return await this.ipCapacitiesRepository.create(newIpCapacity);
  }

  findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }) {
    return this.ipCapacitiesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
      search,
    });
  }

  findById(id: IpCapacity['id']) {
    return this.ipCapacitiesRepository.findById(id);
  }

  async update(
    id: IpCapacity['id'],
    updateIpCapacityDto: UpdateIpCapacityDto,
  ): Promise<IpCapacity | null> {
    const entity = await this.ipCapacitiesRepository.findById(id);

    if (!entity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: { id: 'ipCapacityNotFound' },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate code uniqueness if being updated
    if (updateIpCapacityDto.code && updateIpCapacityDto.code !== entity.code) {
      const existingByCode = await this.ipCapacitiesRepository.findByCode(
        updateIpCapacityDto.code,
      );
      if (existingByCode && existingByCode.id !== id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { code: 'codeAlreadyExists' },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const payload: DeepPartial<IpCapacity> = {};
    if (updateIpCapacityDto.name !== undefined) {
      payload.name = updateIpCapacityDto.name;
    }
    if (updateIpCapacityDto.code !== undefined) {
      payload.code = updateIpCapacityDto.code;
    }
    if (updateIpCapacityDto.cwrCapacity !== undefined) {
      payload.cwrCapacity = updateIpCapacityDto.cwrCapacity;
    }

    return await this.ipCapacitiesRepository.update(id, payload);
  }

  remove(id: IpCapacity['id']) {
    return this.ipCapacitiesRepository.remove(id);
  }
}
