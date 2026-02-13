import { Test, TestingModule } from '@nestjs/testing';
import { PublisherAffiliationsController } from '../../../src/publisher-affiliations/publisher-affiliations.controller';
import { PublisherAffiliationsService } from '../../../src/publisher-affiliations/publisher-affiliations.service';
import { CreatePublisherAffiliationDto } from '../../../src/publisher-affiliations/dto/create-publisher-affiliation.dto';
import { UpdatePublisherAffiliationDto } from '../../../src/publisher-affiliations/dto/update-publisher-affiliation.dto';
import { PublisherAffiliation } from '../../../src/publisher-affiliations/domain/publisher-affiliation';
import { Publisher } from '../../../src/publishers/domain/publisher';
import { Society } from '../../../src/societies/domain/society';
import { infinityPagination } from '@app/utils/infinity-pagination';

// Mock the infinityPagination function
jest.mock('@app/utils/infinity-pagination', () => ({
  infinityPagination: jest.fn((data, query) => ({
    data,
    page: query.page,
    limit: query.limit,
  })),
}));

const mockPublisherAffiliation: PublisherAffiliation = {
  id: 1,
  publisher: { id: 1, name: 'Test Publisher' } as Publisher,
  publicSociety: { id: 1, name: 'Test Public Society' } as Society,
  mechanicalSociety: { id: 2, name: 'Test Mechanical Society' } as Society,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPublisherAffiliationsService = {
  create: jest.fn().mockResolvedValue(mockPublisherAffiliation),
  findManyWithPagination: jest
    .fn()
    .mockResolvedValue([mockPublisherAffiliation]),
  findOne: jest.fn().mockResolvedValue(mockPublisherAffiliation),
  update: jest.fn().mockResolvedValue(mockPublisherAffiliation),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('PublisherAffiliationsController', () => {
  let controller: PublisherAffiliationsController;
  let service: PublisherAffiliationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublisherAffiliationsController],
      providers: [
        {
          provide: PublisherAffiliationsService,
          useValue: mockPublisherAffiliationsService,
        },
      ],
    }).compile();

    controller = module.get<PublisherAffiliationsController>(
      PublisherAffiliationsController,
    );
    service = module.get<PublisherAffiliationsService>(
      PublisherAffiliationsService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a publisher affiliation', async () => {
      const createDto: CreatePublisherAffiliationDto = {
        publisherId: 1,
        publicSocietyId: 1,
        mechanicalSocietyId: 2,
      };
      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockPublisherAffiliation);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of publisher affiliations', async () => {
      const query = { page: 1, limit: 10 };
      const result = await controller.findAll(query);
      expect(service.findManyWithPagination).toHaveBeenCalledWith(query);
      expect(infinityPagination).toHaveBeenCalledWith(
        [mockPublisherAffiliation],
        query,
      );
      expect(result).toEqual({
        data: [mockPublisherAffiliation],
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single publisher affiliation', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockPublisherAffiliation);
    });
  });

  describe('update', () => {
    it('should update a publisher affiliation', async () => {
      const updateDto: UpdatePublisherAffiliationDto = {
        publicSocietyId: 3,
      };
      const result = await controller.update('1', updateDto);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockPublisherAffiliation);
    });
  });

  describe('remove', () => {
    it('should remove a publisher affiliation', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
