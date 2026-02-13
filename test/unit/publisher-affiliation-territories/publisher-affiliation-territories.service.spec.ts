import { Test, TestingModule } from '@nestjs/testing';
import { PublisherAffiliationTerritoriesService } from '../../../src/publisher-affiliation-territories/publisher-affiliation-territories.service';
import { PublisherAffiliationTerritoryRepository } from '../../../src/publisher-affiliation-territories/infrastructure/persistence/publisher-affiliation-territory.repository';
import { PublisherAffiliationTerritory } from '../../../src/publisher-affiliation-territories/domain/publisher-affiliation-territory';
import { CreatePublisherAffiliationTerritoryDto } from '../../../src/publisher-affiliation-territories/dto/create-publisher-affiliation-territory.dto';
import { UpdatePublisherAffiliationTerritoryDto } from '../../../src/publisher-affiliation-territories/dto/update-publisher-affiliation-territory.dto';
import { IPaginationOptions } from '../../../src/utils/types/pagination-options';
import { EntityCondition } from '../../../src/utils/types/entity-condition.type';

const mockPublisherAffiliationTerritory: PublisherAffiliationTerritory = {
  id: 1,
  publisherAffiliation: { id: 1 } as any,
  territory: { id: 1 } as any,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPublisherAffiliationTerritoryRepository = {
  create: jest.fn().mockResolvedValue(mockPublisherAffiliationTerritory),
  findManyWithPagination: jest
    .fn()
    .mockResolvedValue([mockPublisherAffiliationTerritory]),
  findOne: jest.fn().mockResolvedValue(mockPublisherAffiliationTerritory),
  update: jest.fn().mockResolvedValue(mockPublisherAffiliationTerritory),
  softDelete: jest.fn().mockResolvedValue(undefined),
};

describe('PublisherAffiliationTerritoriesService', () => {
  let service: PublisherAffiliationTerritoriesService;
  let repository: PublisherAffiliationTerritoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublisherAffiliationTerritoriesService,
        {
          provide: PublisherAffiliationTerritoryRepository,
          useValue: mockPublisherAffiliationTerritoryRepository,
        },
      ],
    }).compile();

    service = module.get<PublisherAffiliationTerritoriesService>(
      PublisherAffiliationTerritoriesService,
    );
    repository = module.get<PublisherAffiliationTerritoryRepository>(
      PublisherAffiliationTerritoryRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a publisher affiliation territory', async () => {
      const createDto: CreatePublisherAffiliationTerritoryDto = {
        publisherAffiliationId: 1,
        territoryId: 1,
      };
      const result = await service.create(createDto);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockPublisherAffiliationTerritory);
    });
  });

  describe('findManyWithPagination', () => {
    it('should return a paginated list of publisher affiliation territories', async () => {
      const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };
      const result = await service.findManyWithPagination(paginationOptions);
      expect(repository.findManyWithPagination).toHaveBeenCalledWith(
        paginationOptions,
        undefined,
      );
      expect(result).toEqual([mockPublisherAffiliationTerritory]);
    });

    it('should return a paginated list filtered by publisherId', async () => {
      const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };
      const filterOptions = { publisherId: 1 };
      const result = await service.findManyWithPagination(
        paginationOptions,
        filterOptions,
      );
      expect(repository.findManyWithPagination).toHaveBeenCalledWith(
        paginationOptions,
        filterOptions,
      );
      expect(result).toEqual([mockPublisherAffiliationTerritory]);
    });
  });

  describe('findOne', () => {
    it('should return a single publisher affiliation territory', async () => {
      const fields: EntityCondition<PublisherAffiliationTerritory> = { id: 1 };
      const result = await service.findOne(fields);
      expect(repository.findOne).toHaveBeenCalledWith(fields);
      expect(result).toEqual(mockPublisherAffiliationTerritory);
    });
  });

  describe('update', () => {
    it('should update a publisher affiliation territory', async () => {
      const updateDto: UpdatePublisherAffiliationTerritoryDto = {
        territoryId: 2,
      };
      const result = await service.update(1, updateDto);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockPublisherAffiliationTerritory);
    });
  });

  describe('remove', () => {
    it('should soft delete a publisher affiliation territory', async () => {
      await service.remove(1);
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });
  });
});
