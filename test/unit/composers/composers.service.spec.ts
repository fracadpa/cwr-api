import { Test, TestingModule } from '@nestjs/testing';
import { ComposersService } from '../../../src/composers/composers.service';
import { ComposerRepository } from '../../../src/composers/infrastructure/persistence/composer.repository';
import { Composer } from '../../../src/composers/domain/composer';
import { CreateComposerDto } from '../../../src/composers/dto/create-composer.dto';
import { UpdateComposerDto } from '../../../src/composers/dto/update-composer.dto';
import { IPaginationOptions } from '../../../src/utils/types/pagination-options';
import { EntityCondition } from '../../../src/utils/types/entity-condition.type';
import { ControlledComposerEnum } from '../../../src/composers/domain/controlled-composer.enum';
import { IpCapacity } from '../../../src/ip-capacities/domain/ip-capacity';
import { Company } from '../../../src/companies/domain/companies';
import { Tenant } from '../../../src/tenants/domain/tenants';

const mockComposer: Composer = {
  id: 1,
  name: 'Test Composer',
  code: 'COMP-001',
  controlledComposer: ControlledComposerEnum.Owned,
  ipiComposer: 'I-000000001-2',
  composerAlias: 'TC',
  ipCapacity: { id: 1 } as IpCapacity,
  company: { id: 1 } as Company,
  tenant: { id: 'uuid-tenant-1' } as Tenant,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockComposerRepository = {
  create: jest.fn().mockResolvedValue(mockComposer),
  findManyWithPagination: jest.fn().mockResolvedValue([mockComposer]),
  findOne: jest.fn().mockResolvedValue(mockComposer),
  update: jest.fn().mockResolvedValue(mockComposer),
  softDelete: jest.fn().mockResolvedValue(undefined),
};

describe('ComposersService', () => {
  let service: ComposersService;
  let repository: ComposerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComposersService,
        {
          provide: ComposerRepository,
          useValue: mockComposerRepository,
        },
      ],
    }).compile();

    service = module.get<ComposersService>(ComposersService);
    repository = module.get<ComposerRepository>(ComposerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a composer', async () => {
      const createDto: CreateComposerDto = {
        name: 'Test Composer',
        code: 'COMP-001',
        controlledComposer: ControlledComposerEnum.Owned,
        ipiComposer: 'I-000000001-2',
        composerAlias: 'TC',
        ipCapacityId: 1,
        companyId: 1,
        tenantId: 'uuid-tenant-1',
      };
      const result = await service.create(createDto);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockComposer);
    });
  });

  describe('findManyWithPagination', () => {
    it('should return a paginated list of composers', async () => {
      const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };
      const result = await service.findManyWithPagination(paginationOptions);
      expect(repository.findManyWithPagination).toHaveBeenCalledWith(
        paginationOptions,
      );
      expect(result).toEqual([mockComposer]);
    });
  });

  describe('findOne', () => {
    it('should return a single composer', async () => {
      const fields: EntityCondition<Composer> = { id: 1 };
      const result = await service.findOne(fields);
      expect(repository.findOne).toHaveBeenCalledWith(fields);
      expect(result).toEqual(mockComposer);
    });

    it('should return null if composer not found', async () => {
      mockComposerRepository.findOne.mockResolvedValueOnce(null);
      const fields: EntityCondition<Composer> = { id: 999 };
      const result = await service.findOne(fields);
      expect(repository.findOne).toHaveBeenCalledWith(fields);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a composer', async () => {
      const updateDto: UpdateComposerDto = {
        composerAlias: 'New Alias',
      };
      const result = await service.update(1, updateDto);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockComposer);
    });
  });

  describe('remove', () => {
    it('should soft delete a composer', async () => {
      await service.remove(1);
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });
  });
});
