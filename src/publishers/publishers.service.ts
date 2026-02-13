import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Publisher } from './domain/publisher';
import { PublisherRepository } from './infrastructure/persistence/publisher.repository';
import { IpCapacitiesService } from '../ip-capacities/ip-capacities.service';
import { CompaniesService } from '../companies/companies.service';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class PublishersService {
  constructor(
    private readonly publishersRepository: PublisherRepository,
    private readonly ipCapacitiesService: IpCapacitiesService,
    private readonly companiesService: CompaniesService,
    private readonly tenantsService: TenantsService,
  ) {}

  async create(createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    // Validate code uniqueness
    const existingByCode = await this.publishersRepository.findByCode(
      createPublisherDto.code,
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

    // Fetch related entities
    const ipCapacity = await this.ipCapacitiesService.findById(
      createPublisherDto.ipCapacityId,
    );
    if (!ipCapacity) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { ipCapacityId: 'ipCapacityNotFound' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const company = await this.companiesService.findById(
      createPublisherDto.companyId,
    );
    if (!company) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { companyId: 'companyNotFound' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const tenant = await this.tenantsService.findById(
      createPublisherDto.tenantId,
    );
    if (!tenant) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { tenantId: 'tenantNotFound' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newPublisher = new Publisher();
    newPublisher.name = createPublisherDto.name;
    newPublisher.code = createPublisherDto.code;
    newPublisher.controlledPublisher = createPublisherDto.controlledPublisher;
    newPublisher.ipiNumber = createPublisherDto.ipiNumber;
    newPublisher.ipCapacity = ipCapacity;
    newPublisher.company = company;
    newPublisher.tenant = tenant;

    return await this.publishersRepository.create(newPublisher);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.publishersRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Publisher['id']) {
    return this.publishersRepository.findById(id);
  }

  async update(
    id: Publisher['id'],
    updatePublisherDto: UpdatePublisherDto,
  ): Promise<Publisher | null> {
    const entity = await this.publishersRepository.findById(id);

    if (!entity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: { id: 'publisherNotFound' },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate code uniqueness if being updated
    if (updatePublisherDto.code && updatePublisherDto.code !== entity.code) {
      const existingByCode = await this.publishersRepository.findByCode(
        updatePublisherDto.code,
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

    const payload: DeepPartial<Publisher> = {};

    if (updatePublisherDto.name !== undefined) {
      payload.name = updatePublisherDto.name;
    }
    if (updatePublisherDto.code !== undefined) {
      payload.code = updatePublisherDto.code;
    }
    if (updatePublisherDto.controlledPublisher !== undefined) {
      payload.controlledPublisher = updatePublisherDto.controlledPublisher;
    }
    if (updatePublisherDto.ipiNumber !== undefined) {
      payload.ipiNumber = updatePublisherDto.ipiNumber;
    }

    // Fetch related entities if IDs are provided
    if (updatePublisherDto.ipCapacityId !== undefined) {
      const ipCapacity = await this.ipCapacitiesService.findById(
        updatePublisherDto.ipCapacityId,
      );
      if (!ipCapacity) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { ipCapacityId: 'ipCapacityNotFound' },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      payload.ipCapacity = ipCapacity;
    }

    if (updatePublisherDto.companyId !== undefined) {
      const company = await this.companiesService.findById(
        updatePublisherDto.companyId,
      );
      if (!company) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { companyId: 'companyNotFound' },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      payload.company = company;
    }

    if (updatePublisherDto.tenantId !== undefined) {
      const tenant = await this.tenantsService.findById(
        updatePublisherDto.tenantId,
      );
      if (!tenant) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { tenantId: 'tenantNotFound' },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      payload.tenant = tenant;
    }

    return await this.publishersRepository.update(id, payload);
  }

  remove(id: Publisher['id']) {
    return this.publishersRepository.remove(id);
  }
}
