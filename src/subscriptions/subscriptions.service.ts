import {
  Injectable,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionRepository } from './infrastructure/persistence/subscription.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Subscription } from './domain/subscriptions';
import { SubscriptionStatusEnum } from './domain/subscription-status.enum';
import { CompaniesService } from '../companies/companies.service';
import { Company } from '../companies/domain/companies';
import { EntityManager } from 'typeorm'; // Changed from QueryRunner
import { PlansService } from '../plans/plans.service'; // Import PlansService

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    @Inject(forwardRef(() => CompaniesService))
    private readonly companiesService: CompaniesService,
    @Inject(forwardRef(() => PlansService)) // Inject PlansService
    private readonly plansService: PlansService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ) {
    const { companyId, planId, status } = createSubscriptionDto; // Destructure planId

    const company = await this.companiesService.findById(companyId, manager);

    if (!company) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            company: 'companyNotFound',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const plan = await this.plansService.findById(planId, manager); // Find plan by ID

    if (!plan) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            plan: 'planNotFound',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const activeSubscription =
      await this.subscriptionRepository.findActiveSubscriptionByCompanyId(
        companyId,
        manager,
      );

    if (activeSubscription) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            subscription: 'companyAlreadyHasActiveSubscription',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const subscription = await this.subscriptionRepository.create(
      {
        company: company,
        plan: plan, // Add plan to subscription creation
        status: status as SubscriptionStatusEnum,
      },
      manager, // Passed manager
    );

    // Note: Company update is handled by the caller (auth service)
    // to avoid duplicate updates within the same transaction

    return subscription;
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.subscriptionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllByCompanyIdWithPagination({
    companyId,
    paginationOptions,
  }: {
    companyId: Company['id'];
    paginationOptions: IPaginationOptions;
  }) {
    return this.subscriptionRepository.findAllByCompanyIdWithPagination({
      companyId,
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Subscription['id']) {
    return this.subscriptionRepository.findById(id);
  }

  findByIds(ids: Subscription['id'][]) {
    return this.subscriptionRepository.findByIds(ids);
  }

  async update(
    id: Subscription['id'],
    updateSubscriptionDto: UpdateSubscriptionDto,
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ) {
    return this.subscriptionRepository.update(
      id,
      updateSubscriptionDto,
      manager, // Passed manager
    );
  }

  remove(id: Subscription['id']) {
    return this.subscriptionRepository.remove(id);
  }

  async cancelSubscription(
    companyId: Company['id'],
    manager?: EntityManager, // Changed QueryRunner to EntityManager
  ) {
    const activeSubscription =
      await this.subscriptionRepository.findActiveSubscriptionByCompanyId(
        companyId,
      );

    if (activeSubscription) {
      await this.subscriptionRepository.update(
        activeSubscription.id,
        {
          status: SubscriptionStatusEnum.CANCELED,
        },
        manager, // Passed manager
      );

      await this.companiesService.update(
        companyId,
        {
          activeSubscription: null,
        },
        manager, // Passed manager
      );
    }

    return;
  }

  findActiveSubscriptionByCompanyId(
    companyId: Company['id'],
    manager?: EntityManager,
  ) {
    return this.subscriptionRepository.findActiveSubscriptionByCompanyId(
      companyId,
      manager,
    );
  }
}
