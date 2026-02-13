import { Test, TestingModule } from '@nestjs/testing';
import { PublisherAffiliationsService } from '../../../src/publisher-affiliations/publisher-affiliations.service';
import { PublisherAffiliationRepository } from '../../../src/publisher-affiliations/infrastructure/persistence/publisher-affiliation.repository';
import { PublisherAffiliation } from '../../../src/publisher-affiliations/domain/publisher-affiliation';
import { CreatePublisherAffiliationDto } from '../../../src/publisher-affiliations/dto/create-publisher-affiliation.dto';
import { UpdatePublisherAffiliationDto } from '../../../src/publisher-affiliations/dto/update-publisher-affiliation.dto';
import { IPaginationOptions } from '../../../src/utils/types/pagination-options';
import { EntityCondition } from '../../../src/utils/types/entity-condition.type';
import { Publisher } from '../../../src/publishers/domain/publisher';
import { Society } from '../../../src/societies/domain/society';

const mockPublisherAffiliation: PublisherAffiliation = {
  id: 1,
  publisher: { id: 1, name: 'Test Publisher' } as Publisher,
  publicSociety: { id: 1, name: 'Test Public Society' } as Society,
  mechanicalSociety: { id: 2, name: 'Test Mechanical Society' } as Society,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPublisherAffiliationRepository = {
  create: jest.fn().mockResolvedValue(mockPublisherAffiliation),
  findManyWithPagination: jest
    .fn()
    .mockResolvedValue([mockPublisherAffiliation]),
  findOne: jest.fn().mockResolvedValue(mockPublisherAffiliation),
  update: jest.fn().mockResolvedValue(mockPublisherAffiliation),
  softDelete: jest.fn().mockResolvedValue(undefined),
};

describe('PublisherAffiliationsService', () => {
  let service: PublisherAffiliationsService;
  let repository: PublisherAffiliationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublisherAffiliationsService,
        {
          provide: PublisherAffiliationRepository,
          useValue: mockPublisherAffiliationRepository,
        },
      ],
    }).compile();

    service = module.get<PublisherAffiliationsService>(
      PublisherAffiliationsService,
    );
    repository = module.get<PublisherAffiliationRepository>(
      PublisherAffiliationRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a publisher affiliation', async () => {
      const createDto: CreatePublisherAffiliationDto = {
        publisherId: 1,
        publicSocietyId: 1,
        mechanicalSocietyId: 2,
      };
      const result = await service.create(createDto);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockPublisherAffiliation);
    });
  });

  describe('findManyWithPagination', () => {
    it('should return a paginated list of publisher affiliations', async () => {
      const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };
      const result = await service.findManyWithPagination(paginationOptions);
      expect(repository.findManyWithPagination).toHaveBeenCalledWith(
        paginationOptions,
      );
      expect(result).toEqual([mockPublisherAffiliation]);
    });
  });

  describe('findOne', () => {
    it('should return a single publisher affiliation', async () => {
      const fields: EntityCondition<PublisherAffiliation> = { id: 1 };
      const result = await service.findOne(fields);
      expect(repository.findOne).toHaveBeenCalledWith(fields);
      expect(result).toEqual(mockPublisherAffiliation);
    });

    it('should return null if publisher affiliation not found', async () => {
      mockPublisherAffiliationRepository.findOne.mockResolvedValueOnce(null);
      const fields: EntityCondition<PublisherAffiliation> = { id: 999 };
      const result = await service.findOne(fields);
      expect(repository.findOne).toHaveBeenCalledWith(fields);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a publisher affiliation', async () => {
      const updateDto: UpdatePublisherAffiliationDto = {
        publicSocietyId: 3,
      };
      const result = await service.update(1, updateDto);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockPublisherAffiliation);
    });
  });

  describe('remove', () => {
    it('should soft delete a publisher affiliation', async () => {
      await service.remove(1);
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });
  });
});
