import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Company } from './domain/companies';
import { EntityManager } from 'typeorm'; // Changed from QueryRunner
import { CompanyRepository } from './infrastructure/persistence/company.repository';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompanyRepository) {}

  async create(createCompanyDto: CreateCompanyDto, manager?: EntityManager) {
    const newCompany = new Company();
    newCompany.name = createCompanyDto.name;

    const existingCompany = await this.companiesRepository.findByName(
      newCompany.name,
    );
    if (existingCompany) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: { name: 'companyNameAlreadyExists' },
        },
        HttpStatus.CONFLICT,
      );
    }

    return await this.companiesRepository.create(newCompany, manager);
  }

  findAllWithPagination({
    paginationOptions,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
  }) {
    return this.companiesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
      search,
    });
  }

  findById(id: Company['id'], manager?: EntityManager) {
    return this.companiesRepository.findById(id, manager);
  }

  findByIds(ids: Company['id'][]) {
    return this.companiesRepository.findByIds(ids);
  }

  async update(
    id: Company['id'],
    payload: DeepPartial<Company>,
    manager?: EntityManager,
  ) {
    const entity = await this.companiesRepository.findById(id, manager);

    if (!entity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: { id: 'companyNotFound' },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (payload.name && payload.name !== entity.name) {
      const existingCompany = await this.companiesRepository.findByName(
        payload.name,
        manager,
      );
      if (existingCompany && existingCompany.id !== id) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            errors: { name: 'companyNameAlreadyExists' },
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    return await this.companiesRepository.update(id, payload, manager);
  }

  remove(id: Company['id']) {
    return this.companiesRepository.remove(id);
  }

  findByName(name: string) {
    return this.companiesRepository.findByName(name);
  }
}
