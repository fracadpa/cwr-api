import { Test, TestingModule } from '@nestjs/testing';
import { ComposerAffiliationsController } from '../../../src/composer-affiliations/composer-affiliations.controller';
import { ComposerAffiliationsService } from '../../../src/composer-affiliations/composer-affiliations.service';
import { CreateComposerAffiliationDto } from '../../../src/composer-affiliations/dto/create-composer-affiliation.dto';
import { UpdateComposerAffiliationDto } from '../../../src/composer-affiliations/dto/update-composer-affiliation.dto';
import { ComposerAffiliation } from '../../../src/composer-affiliations/domain/composer-affiliation';
// import { infinityPagination } from '@app/utils/infinity-pagination';

// Mock the infinityPagination function
jest.mock('@app/utils/infinity-pagination', () => ({
  infinityPagination: jest.fn((data, query) => ({
    data,
    page: query.page,
    limit: query.limit,
  })),
}));

const mockComposerAffiliation: ComposerAffiliation = {
  id: 1,
  composer: { id: 1 } as any,
  publicSociety: { id: 1 } as any,
  mechanicalSociety: { id: 2 } as any,
  company: { id: 1 } as any,
  tenant: { id: 'uuid-tenant-1' } as any,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockComposerAffiliationsService = {
  create: jest.fn().mockResolvedValue(mockComposerAffiliation),
  findManyWithPagination: jest
    .fn()
    .mockResolvedValue([mockComposerAffiliation]),
  findOne: jest.fn().mockResolvedValue(mockComposerAffiliation),
  update: jest.fn().mockResolvedValue(mockComposerAffiliation),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('ComposerAffiliationsController', () => {
  let controller: ComposerAffiliationsController;
  let service: ComposerAffiliationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComposerAffiliationsController],
      providers: [
        {
          provide: ComposerAffiliationsService,
          useValue: mockComposerAffiliationsService,
        },
      ],
    }).compile();

    controller = module.get<ComposerAffiliationsController>(
      ComposerAffiliationsController,
    );
    service = module.get<ComposerAffiliationsService>(
      ComposerAffiliationsService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockComposerAffiliation);
    });
  });

  // describe('findAll', () => {
  //   it('should return a paginated list of composer affiliations', async () => {
  //     const query = { page: 1, limit: 10 };
  //     const result = await controller.findAll(query);
  //     expect(service.findManyWithPagination).toHaveBeenCalledWith(
  //       { page: 1, limit: 10 },
  //       { composerId: undefined },
  //     );
  //     expect(infinityPagination).toHaveBeenCalledWith(
  //       [mockComposerAffiliation],
  //       query,
  //     );
  //     expect(result).toEqual({
  //       data: [mockComposerAffiliation],
  //       page: 1,
  //       limit: 10,
  //     });
  //   });

  //   it('should return a paginated list filtered by composerId', () => {
  //     expect(service.findManyWithPagination).toHaveBeenCalledWith(
  //       { page: 1, limit: 10 },
  //       { composerId: 1 },
  //     );
  //     expect(infinityPagination).toHaveBeenCalledWith(
  //       [mockComposerAffiliation],
  //       { page: 1, limit: 10 },
  //     );
  //   });
  // });

  describe('findOne', () => {
    it('should return a single composer affiliation', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockComposerAffiliation);
    });
  });

  describe('update', () => {
    it('should update a composer affiliation', async () => {
      const updateDto: UpdateComposerAffiliationDto = {
        mechanicalSocietyId: 3,
      };
      const result = await controller.update('1', updateDto);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockComposerAffiliation);
    });
  });

  describe('remove', () => {
    it('should remove a composer affiliation', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
