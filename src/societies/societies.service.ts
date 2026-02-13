import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Society } from './domain/society';
import { SocietyRepository } from './infrastructure/persistence/society.repository';

@Injectable()
export class SocietiesService {
  constructor(private readonly societiesRepository: SocietyRepository) {}

  async create(createSocietyDto: CreateSocietyDto): Promise<Society> {
    // Validate cisacCode uniqueness
    const existingByCisacCode = await this.societiesRepository.findByCisacCode(
      createSocietyDto.cisacCode,
    );
    if (existingByCisacCode) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { cisacCode: 'cisacCodeAlreadyExists' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Validate cwrSocietyId if provided
    if (createSocietyDto.cwrSocietyId) {
      const parentSociety = await this.societiesRepository.findById(
        createSocietyDto.cwrSocietyId,
      );
      if (!parentSociety) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { cwrSocietyId: 'parentSocietyNotFound' },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const newSociety = new Society();
    newSociety.name = createSocietyDto.name;
    newSociety.cwrSocietyId = createSocietyDto.cwrSocietyId ?? null;
    newSociety.cwrVer = createSocietyDto.cwrVer;
    newSociety.cisacCode = createSocietyDto.cisacCode;

    return await this.societiesRepository.create(newSociety);
  }

  findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }) {
    return this.societiesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
      search,
    });
  }

  findById(id: Society['id']) {
    return this.societiesRepository.findById(id);
  }

  async update(
    id: Society['id'],
    updateSocietyDto: UpdateSocietyDto,
  ): Promise<Society | null> {
    const entity = await this.societiesRepository.findById(id);

    if (!entity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: { id: 'societyNotFound' },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate cisacCode uniqueness if being updated
    if (
      updateSocietyDto.cisacCode &&
      updateSocietyDto.cisacCode !== entity.cisacCode
    ) {
      const existingByCisacCode =
        await this.societiesRepository.findByCisacCode(
          updateSocietyDto.cisacCode,
        );
      if (existingByCisacCode && existingByCisacCode.id !== id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { cisacCode: 'cisacCodeAlreadyExists' },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    // Validate cwrSocietyId if being updated
    if (updateSocietyDto.cwrSocietyId !== undefined) {
      // Prevent circular self-reference
      if (updateSocietyDto.cwrSocietyId === id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { cwrSocietyId: 'cannotReferenceSelf' },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      if (updateSocietyDto.cwrSocietyId !== null) {
        const parentSociety = await this.societiesRepository.findById(
          updateSocietyDto.cwrSocietyId,
        );
        if (!parentSociety) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: { cwrSocietyId: 'parentSocietyNotFound' },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }
    }

    const payload: DeepPartial<Society> = {};
    if (updateSocietyDto.name !== undefined) {
      payload.name = updateSocietyDto.name;
    }
    if (updateSocietyDto.cwrSocietyId !== undefined) {
      payload.cwrSocietyId = updateSocietyDto.cwrSocietyId;
    }
    if (updateSocietyDto.cwrVer !== undefined) {
      payload.cwrVer = updateSocietyDto.cwrVer;
    }
    if (updateSocietyDto.cisacCode !== undefined) {
      payload.cisacCode = updateSocietyDto.cisacCode;
    }

    return await this.societiesRepository.update(id, payload);
  }

  remove(id: Society['id']) {
    return this.societiesRepository.remove(id);
  }
}
