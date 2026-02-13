import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from '../../../src/companies/companies.service';
import { CompanyRepository } from '../../../src/companies/infrastructure/persistence/company.repository';
import { CreateCompanyDto } from '../../../src/companies/dto/create-company.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Company } from '../../../src/companies/domain/companies';
import { DeepPartial } from '../../../src/utils/types/deep-partial.type';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companyRepository: CompanyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: CompanyRepository,
          useValue: {
            create: jest.fn(),
            findByName: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    companyRepository = module.get<CompanyRepository>(CompanyRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCompanyDto: CreateCompanyDto = {
      name: 'Unique Company',
    };
    const mockCompany: Company = {
      id: 1,
      name: 'Unique Company',
      tenants: [],
      subscriptions: [],
      activeSubscription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a company successfully with a unique name', async () => {
      jest.spyOn(companyRepository, 'findByName').mockResolvedValue(null);
      jest.spyOn(companyRepository, 'create').mockResolvedValue(mockCompany);

      const result = await service.create(createCompanyDto);
      expect(result).toEqual(mockCompany);
      expect(companyRepository.findByName).toHaveBeenCalledWith(
        createCompanyDto.name,
      );
      expect(companyRepository.create).toHaveBeenCalled();
    });

    it('should throw HttpException if company name already exists', async () => {
      jest
        .spyOn(companyRepository, 'findByName')
        .mockResolvedValue(mockCompany);

      await expect(service.create(createCompanyDto)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.CONFLICT,
            errors: { name: 'companyNameAlreadyExists' },
          },
          HttpStatus.CONFLICT,
        ),
      );
      expect(companyRepository.findByName).toHaveBeenCalledWith(
        createCompanyDto.name,
      );
      expect(companyRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const companyId = 1;
    const existingCompany: Company = {
      id: companyId,
      name: 'Original Company',
      tenants: [],
      subscriptions: [],
      activeSubscription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedCompany: Company = {
      ...existingCompany,
      name: 'Updated Company',
    };
    const duplicateCompany: Company = {
      id: 2,
      name: 'Duplicate Company',
      tenants: [],
      subscriptions: [],
      activeSubscription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update company name successfully to a unique name', async () => {
      jest
        .spyOn(companyRepository, 'findById')
        .mockResolvedValue(existingCompany);
      jest.spyOn(companyRepository, 'findByName').mockResolvedValue(null);
      jest
        .spyOn(companyRepository, 'update')
        .mockResolvedValue(updatedCompany as Company);

      const payload: DeepPartial<Company> = { name: 'Updated Company' };
      const result = await service.update(companyId, payload);

      expect(result).toEqual(updatedCompany);
      expect(companyRepository.findById).toHaveBeenCalledWith(
        companyId,
        undefined,
      );
      expect(companyRepository.findByName).toHaveBeenCalledWith(
        payload.name,
        undefined,
      );
      expect(companyRepository.update).toHaveBeenCalledWith(
        companyId,
        payload,
        undefined,
      );
    });

    it('should throw HttpException if company not found', async () => {
      jest.spyOn(companyRepository, 'findById').mockResolvedValue(null);

      const payload: DeepPartial<Company> = { name: 'Updated Company' };
      await expect(service.update(companyId, payload)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            errors: { id: 'companyNotFound' },
          },
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(companyRepository.findById).toHaveBeenCalledWith(
        companyId,
        undefined,
      );
      expect(companyRepository.findByName).not.toHaveBeenCalled();
      expect(companyRepository.update).not.toHaveBeenCalled();
    });

    it('should throw HttpException if new name already exists for another company', async () => {
      jest
        .spyOn(companyRepository, 'findById')
        .mockResolvedValue(existingCompany);
      jest
        .spyOn(companyRepository, 'findByName')
        .mockResolvedValue(duplicateCompany);

      const payload: DeepPartial<Company> = { name: 'Duplicate Company' };
      await expect(service.update(companyId, payload)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.CONFLICT,
            errors: { name: 'companyNameAlreadyExists' },
          },
          HttpStatus.CONFLICT,
        ),
      );
      expect(companyRepository.findById).toHaveBeenCalledWith(
        companyId,
        undefined,
      );
      expect(companyRepository.findByName).toHaveBeenCalledWith(
        payload.name,
        undefined,
      );
      expect(companyRepository.update).not.toHaveBeenCalled();
    });

    it('should update other properties without name change', async () => {
      const payload: DeepPartial<Company> = {
        name: existingCompany.name, // Same name
        createdAt: new Date(2020, 1, 1),
      };
      const updatedCompanyWithoutNameChange = {
        ...existingCompany,
        ...payload,
      };

      jest
        .spyOn(companyRepository, 'findById')
        .mockResolvedValue(existingCompany);
      jest
        .spyOn(companyRepository, 'update')
        .mockResolvedValue(updatedCompanyWithoutNameChange as Company);

      const result = await service.update(companyId, payload);

      expect(result).toEqual(updatedCompanyWithoutNameChange);
      expect(companyRepository.findById).toHaveBeenCalledWith(
        companyId,
        undefined,
      );
      // findByName should not be called if name is not changed or is the same
      expect(companyRepository.findByName).not.toHaveBeenCalledWith(
        payload.name,
      );
      expect(companyRepository.update).toHaveBeenCalledWith(
        companyId,
        payload,
        undefined,
      );
    });

    it('should not throw error if name is not changed and matches current company', async () => {
      jest
        .spyOn(companyRepository, 'findById')
        .mockResolvedValue(existingCompany);
      jest
        .spyOn(companyRepository, 'findByName')
        .mockResolvedValue(existingCompany as Company); // findByName returns current company
      jest
        .spyOn(companyRepository, 'update')
        .mockResolvedValue(existingCompany as Company);

      const payload: DeepPartial<Company> = { name: existingCompany.name };
      const result = await service.update(companyId, payload);

      expect(result).toBeDefined(); // Just expect it to not throw
      expect(companyRepository.findById).toHaveBeenCalledWith(
        companyId,
        undefined,
      );
      expect(companyRepository.findByName).not.toHaveBeenCalled();
      // update should be called regardless if findByName returns the same company
      expect(companyRepository.update).toHaveBeenCalledWith(
        companyId,
        payload,
        undefined,
      );
    });
  });
});
