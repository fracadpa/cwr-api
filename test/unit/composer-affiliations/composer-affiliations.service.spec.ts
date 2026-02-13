import { Test, TestingModule } from '@nestjs/testing';
import { ComposerAffiliationsService } from '../../../src/composer-affiliations/composer-affiliations.service';
import { ComposerAffiliationRepository } from '../../../src/composer-affiliations/infrastructure/persistence/composer-affiliation.repository';
import { ComposerAffiliation } from '../../../src/composer-affiliations/domain/composer-affiliation';
import { CreateComposerAffiliationDto } from '../../../src/composer-affiliations/dto/create-composer-affiliation.dto';
import { UpdateComposerAffiliationDto } from '../../../src/composer-affiliations/dto/update-composer-affiliation.dto';
import { IPaginationOptions } from '../../../src/utils/types/pagination-options';
import { EntityCondition } from '../../../src/utils/types/entity-condition.type';
import { Composer } from '../../../src/composers/domain/composer';
import { Society } from '../../../src/societies/domain/society';
import { Company } from '../../../src/companies/domain/companies';
import { Tenant } from '../../../src/tenants/domain/tenants';

const mockComposerAffiliation: ComposerAffiliation = {
  id: 1,
  composer: { id: 1 } as Composer,
  publicSociety: { id: 1 } as Society,
  mechanicalSociety: { id: 2 } as Society,
  company: { id: 1 } as Company,
  tenant: { id: 'uuid-tenant-1' } as Tenant,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockComposerAffiliationRepository = {
  create: jest.fn().mockResolvedValue(mockComposerAffiliation),
  findManyWithPagination: jest
    .fn()
    .mockResolvedValue([mockComposerAffiliation]),
  findOne: jest.fn().mockResolvedValue(mockComposerAffiliation),
  update: jest.fn().mockResolvedValue(mockComposerAffiliation),
  softDelete: jest.fn().mockResolvedValue(undefined),
};

describe('ComposerAffiliationsService', () => {
  let service: ComposerAffiliationsService;
  let repository: ComposerAffiliationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComposerAffiliationsService,
        {
          provide: ComposerAffiliationRepository,
          useValue: mockComposerAffiliationRepository,
        },
      ],
    }).compile();

    service = module.get<ComposerAffiliationsService>(
      ComposerAffiliationsService,
    );
    repository = module.get<ComposerAffiliationRepository>(
      ComposerAffiliationRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a composer affiliation', async () => {
      const createDto: CreateComposerAffiliationDto = {
        composerId: 1,
        publicSocietyId: 1,
        mechanicalSocietyId: 2,
        companyId: 1,
        tenantId: 'uuid-tenant-1',
      };
      const result = await service.create(createDto);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockComposerAffiliation);
    });
  });

  describe('findManyWithPagination', () => {
    it('should return a paginated list of composer affiliations', async () => {
      const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };
      const result = await service.findManyWithPagination(paginationOptions);
      expect(repository.findManyWithPagination).toHaveBeenCalledWith(
        paginationOptions,
        undefined,
      );
      expect(result).toEqual([mockComposerAffiliation]);
    });

    it('should return a paginated list of composer affiliations filtered by composerId', async () => {
      const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };
      const filterOptions = { composerId: 1 };
      const result = await service.findManyWithPagination(
        paginationOptions,
        filterOptions,
      );
      expect(repository.findManyWithPagination).toHaveBeenCalledWith(
        paginationOptions,
        filterOptions,
      );
      expect(result).toEqual([mockComposerAffiliation]);
    });
  });

  describe('findOne', () => {
    it('should return a single composer affiliation', async () => {
      const fields: EntityCondition<ComposerAffiliation> = { id: 1 };
      const result = await service.findOne(fields);
      expect(repository.findOne).toHaveBeenCalledWith(fields);
      expect(result).toEqual(mockComposerAffiliation);
    });
  });

  describe('update', () => {
    it('should update a composer affiliation', async () => {
      const updateDto: UpdateComposerAffiliationDto = {
        mechanicalSocietyId: 3,
      };
      const result = await service.update(1, updateDto);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockComposerAffiliation);
    });
  });

  describe('remove', () => {
    it('should soft delete a composer affiliation', async () => {
      await service.remove(1);
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });
  });
});
