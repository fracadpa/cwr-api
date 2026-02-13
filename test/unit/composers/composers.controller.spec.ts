import { Test, TestingModule } from '@nestjs/testing';
import { ComposersController } from '../../../src/composers/composers.controller';
import { ComposersService } from '../../../src/composers/composers.service';
import { CreateComposerDto } from '../../../src/composers/dto/create-composer.dto';
import { UpdateComposerDto } from '../../../src/composers/dto/update-composer.dto';
import { Composer } from '../../../src/composers/domain/composer';
import { ControlledComposerEnum } from '../../../src/composers/domain/controlled-composer.enum';
import { infinityPagination } from '@app/utils/infinity-pagination';

// Mock the infinityPagination function
jest.mock('@app/utils/infinity-pagination', () => ({
  infinityPagination: jest.fn((data, query) => ({
    data,
    page: query.page,
    limit: query.limit,
  })),
}));

const mockComposer: Composer = {
  id: 1,
  name: 'Test Composer',
  code: 'COMP-001',
  controlledComposer: ControlledComposerEnum.Owned,
  ipiComposer: 'I-000000001-2',
  composerAlias: 'TC',
  ipCapacity: { id: 1 } as any,
  company: { id: 1 } as any,
  tenant: { id: 'uuid-tenant-1' } as any,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockComposersService = {
  create: jest.fn().mockResolvedValue(mockComposer),
  findManyWithPagination: jest.fn().mockResolvedValue([mockComposer]),
  findOne: jest.fn().mockResolvedValue(mockComposer),
  update: jest.fn().mockResolvedValue(mockComposer),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('ComposersController', () => {
  let controller: ComposersController;
  let service: ComposersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComposersController],
      providers: [
        {
          provide: ComposersService,
          useValue: mockComposersService,
        },
      ],
    }).compile();

    controller = module.get<ComposersController>(ComposersController);
    service = module.get<ComposersService>(ComposersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a composer', async () => {
      const createDto: CreateComposerDto = {
        name: 'Test Composer',
        code: 'COMP-001',
        controlledComposer: ControlledComposerEnum.Owned,
        ipCapacityId: 1,
        companyId: 1,
        tenantId: 'uuid-tenant-1',
      };
      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockComposer);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of composers', async () => {
      const query = { page: 1, limit: 10 };
      const result = await controller.findAll(query);
      expect(service.findManyWithPagination).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(infinityPagination).toHaveBeenCalledWith([mockComposer], query);
      expect(result).toEqual({ data: [mockComposer], page: 1, limit: 10 });
    });
  });

  describe('findOne', () => {
    it('should return a single composer', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockComposer);
    });
  });

  describe('update', () => {
    it('should update a composer', async () => {
      const updateDto: UpdateComposerDto = {
        composerAlias: 'New Alias',
      };
      const result = await controller.update('1', updateDto);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockComposer);
    });
  });

  describe('remove', () => {
    it('should remove a composer', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
