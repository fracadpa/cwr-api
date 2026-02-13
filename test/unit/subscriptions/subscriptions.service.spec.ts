import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from '../../../src/subscriptions/subscriptions.service';
import { SubscriptionRepository } from '../../../src/subscriptions/infrastructure/persistence/subscription.repository';
import { CompaniesService } from '../../../src/companies/companies.service';
import { CreateSubscriptionDto } from '../../../src/subscriptions/dto/create-subscription.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SubscriptionStatusEnum } from '../../../src/subscriptions/domain/subscription-status.enum';
import { Company } from '../../../src/companies/domain/companies';
import { Subscription } from '../../../src/subscriptions/domain/subscriptions';
import { Plan } from '../../../src/plans/domain/plans'; // Import Plan
import { PlansService } from '../../../src/plans/plans.service'; // Import PlansService

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let subscriptionRepository: SubscriptionRepository;
  let companiesService: CompaniesService;
  let plansService: PlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: SubscriptionRepository,
          useValue: {
            create: jest.fn(),
            findActiveSubscriptionByCompanyId: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: CompaniesService,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: PlansService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    subscriptionRepository = module.get<SubscriptionRepository>(
      SubscriptionRepository,
    );
    companiesService = module.get<CompaniesService>(CompaniesService);
    plansService = module.get<PlansService>(PlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockPlan: Plan = {
      id: 1,
      name: 'Free',
      price: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createSubscriptionDto: CreateSubscriptionDto = {
      companyId: 1,
      planId: mockPlan.id, // Added planId
      status: SubscriptionStatusEnum.ACTIVE,
    };
    const mockCompany: Company = {
      id: 2,
      name: 'Test Company',
      tenants: [],
      subscriptions: [],
      activeSubscription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockSubscription: Subscription = {
      id: 3,
      status: SubscriptionStatusEnum.ACTIVE,
      company: mockCompany,
      plan: mockPlan, // Added plan
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.spyOn(plansService, 'findById').mockResolvedValue(mockPlan);
    });

    it('should create a subscription successfully', async () => {
      jest.spyOn(companiesService, 'findById').mockResolvedValue(mockCompany);
      jest
        .spyOn(subscriptionRepository, 'findActiveSubscriptionByCompanyId')
        .mockResolvedValue(null);
      jest
        .spyOn(subscriptionRepository, 'create')
        .mockResolvedValue(mockSubscription);
      jest.spyOn(companiesService, 'update').mockResolvedValue(mockCompany);

      const result = await service.create(createSubscriptionDto);
      expect(result).toEqual(mockSubscription);
      expect(companiesService.findById).toHaveBeenCalledWith(
        createSubscriptionDto.companyId,
        undefined,
      );
      expect(plansService.findById).toHaveBeenCalledWith(
        createSubscriptionDto.planId,
        undefined,
      );
      expect(
        subscriptionRepository.findActiveSubscriptionByCompanyId,
      ).toHaveBeenCalledWith(createSubscriptionDto.companyId, undefined);
      expect(subscriptionRepository.create).toHaveBeenCalledWith(
        {
          company: mockCompany,
          plan: mockPlan,
          status: createSubscriptionDto.status,
        },
        undefined,
      );
    });

    it('should throw HttpException if company not found', async () => {
      jest.spyOn(companiesService, 'findById').mockResolvedValue(null);

      await expect(service.create(createSubscriptionDto)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            errors: { company: 'companyNotFound' },
          },
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw HttpException if company already has an active subscription', async () => {
      jest.spyOn(companiesService, 'findById').mockResolvedValue(mockCompany);
      jest
        .spyOn(subscriptionRepository, 'findActiveSubscriptionByCompanyId')
        .mockResolvedValue(mockSubscription);

      await expect(service.create(createSubscriptionDto)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { subscription: 'companyAlreadyHasActiveSubscription' },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });
  });

  describe('cancelSubscription', () => {
    const companyId = 2;
    const mockCompany: Company = {
      id: companyId,
      name: 'Test Company',
      tenants: [],
      subscriptions: [],
      activeSubscription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockPlan: Plan = {
      id: 1,
      name: 'Free',
      price: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockActiveSubscription: Subscription = {
      id: 3,
      status: SubscriptionStatusEnum.ACTIVE,
      company: mockCompany,
      plan: mockPlan, // Added plan
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should cancel an active subscription successfully', async () => {
      jest
        .spyOn(subscriptionRepository, 'findActiveSubscriptionByCompanyId')
        .mockResolvedValue(mockActiveSubscription);
      jest.spyOn(subscriptionRepository, 'update').mockResolvedValue({
        ...mockActiveSubscription,
        status: SubscriptionStatusEnum.CANCELED,
      });
      jest.spyOn(companiesService, 'update').mockResolvedValue({
        ...mockCompany,
        activeSubscription: null,
      });

      await service.cancelSubscription(companyId);

      expect(
        subscriptionRepository.findActiveSubscriptionByCompanyId,
      ).toHaveBeenCalledWith(companyId);
      expect(subscriptionRepository.update).toHaveBeenCalledWith(
        mockActiveSubscription.id,
        { status: SubscriptionStatusEnum.CANCELED },
        undefined,
      );
      expect(companiesService.update).toHaveBeenCalledWith(
        companyId,
        { activeSubscription: null },
        undefined,
      );
    });

    it('should do nothing if no active subscription is found', async () => {
      jest
        .spyOn(subscriptionRepository, 'findActiveSubscriptionByCompanyId')
        .mockResolvedValue(null);
      jest.spyOn(subscriptionRepository, 'update').mockResolvedValue(null);

      await service.cancelSubscription(companyId);

      expect(
        subscriptionRepository.findActiveSubscriptionByCompanyId,
      ).toHaveBeenCalledWith(companyId);
      expect(subscriptionRepository.update).not.toHaveBeenCalled();
      expect(companiesService.update).not.toHaveBeenCalled();
    });
  });
});
