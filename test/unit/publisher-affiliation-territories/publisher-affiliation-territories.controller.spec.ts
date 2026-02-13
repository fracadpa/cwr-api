import { Test, TestingModule } from '@nestjs/testing';
import { PublisherAffiliationTerritoriesController } from '../../../src/publisher-affiliation-territories/publisher-affiliation-territories.controller';
import { PublisherAffiliationTerritoriesService } from '../../../src/publisher-affiliation-territories/publisher-affiliation-territories.service';
import { CreatePublisherAffiliationTerritoryDto } from '../../../src/publisher-affiliation-territories/dto/create-publisher-affiliation-territory.dto';
import { UpdatePublisherAffiliationTerritoryDto } from '../../../src/publisher-affiliation-territories/dto/update-publisher-affiliation-territory.dto';
import { PublisherAffiliationTerritory } from '../../../src/publisher-affiliation-territories/domain/publisher-affiliation-territory';
// import { infinityPagination } from '@app/utils/infinity-pagination';

// Mock the infinityPagination function
jest.mock('@app/utils/infinity-pagination', () => ({
  infinityPagination: jest.fn((data, query) => ({
    data,
    page: query.page,
    limit: query.limit,
  })),
}));

const mockPublisherAffiliationTerritory: PublisherAffiliationTerritory = {
  id: 1,
  publisherAffiliation: { id: 1 } as any,
  territory: { id: 1 } as any,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPublisherAffiliationTerritoriesService = {
  create: jest.fn().mockResolvedValue(mockPublisherAffiliationTerritory),
  findManyWithPagination: jest
    .fn()
    .mockResolvedValue([mockPublisherAffiliationTerritory]),
  findOne: jest.fn().mockResolvedValue(mockPublisherAffiliationTerritory),
  update: jest.fn().mockResolvedValue(mockPublisherAffiliationTerritory),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('PublisherAffiliationTerritoriesController', () => {
  let controller: PublisherAffiliationTerritoriesController;
  let service: PublisherAffiliationTerritoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublisherAffiliationTerritoriesController],
      providers: [
        {
          provide: PublisherAffiliationTerritoriesService,
          useValue: mockPublisherAffiliationTerritoriesService,
        },
      ],
    }).compile();

    controller = module.get<PublisherAffiliationTerritoriesController>(
      PublisherAffiliationTerritoriesController,
    );
    service = module.get<PublisherAffiliationTerritoriesService>(
      PublisherAffiliationTerritoriesService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a publisher affiliation territory', async () => {
      const createDto: CreatePublisherAffiliationTerritoryDto = {
        publisherAffiliationId: 1,
        territoryId: 1,
      };
      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockPublisherAffiliationTerritory);
    });
  });

  // describe('findAll', () => {
  //   it('should return a paginated list of publisher affiliation territories', async () => {
  //     const query = { page: 1, limit: 10 };
  //     const result = await controller.findAll(query);
  //     expect(service.findManyWithPagination).toHaveBeenCalledWith(
  //       { page: 1, limit: 10 },
  //       { publisherId: undefined },
  //     );
  //     expect(infinityPagination).toHaveBeenCalledWith(
  //       [mockPublisherAffiliationTerritory],
  //       query,
  //     );
  //     expect(result).toEqual({
  //       data: [mockPublisherAffiliationTerritory],
  //       page: 1,
  //       limit: 10,
  //     });
  //   });

  //   it('should return a paginated list filtered by publisherId', () => {
  //     expect(service.findManyWithPagination).toHaveBeenCalledWith(
  //       { page: 1, limit: 10 },
  //       { publisherId: 1 },
  //     );
  //     expect(infinityPagination).toHaveBeenCalledWith(
  //       [mockPublisherAffiliationTerritory],
  //       { page: 1, limit: 10 },
  //     );
  //   });
  // });

  describe('findOne', () => {
    it('should return a single publisher affiliation territory', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockPublisherAffiliationTerritory);
    });
  });

  describe('update', () => {
    it('should update a publisher affiliation territory', async () => {
      const updateDto: UpdatePublisherAffiliationTerritoryDto = {
        territoryId: 2,
      };
      const result = await controller.update('1', updateDto);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockPublisherAffiliationTerritory);
    });
  });

  describe('remove', () => {
    it('should remove a publisher affiliation territory', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
