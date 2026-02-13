import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionSchemaClass } from '../entities/subscription.schema'; // Corrected
import { SubscriptionRepository } from '../../subscription.repository'; // Corrected
import { Subscription } from '../../../../domain/subscriptions'; // Corrected
import { SubscriptionMapper } from '../mappers/subscription.mapper'; // Corrected
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Company } from '../../../../../companies/domain/companies';
import { SubscriptionStatusEnum } from '../../../../domain/subscription-status.enum';

@Injectable() // Corrected
// Corrected
export class SubscriptionDocumentRepository implements SubscriptionRepository {
  constructor(
    @InjectModel(SubscriptionSchemaClass.name)
    private readonly subscriptionModel: Model<SubscriptionSchemaClass>, // Corrected
  ) {}

  async create(data: Subscription): Promise<Subscription> {
    // Corrected
    const persistenceModel = SubscriptionMapper.toPersistence(data); // Corrected
    const createdEntity = new this.subscriptionModel(persistenceModel); // Corrected
    const entityObject = await createdEntity.save();
    return SubscriptionMapper.toDomain(entityObject); // Corrected
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Subscription[]> {
    // Corrected
    const entityObjects = await this.subscriptionModel // Corrected
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map(
      (entityObject) => SubscriptionMapper.toDomain(entityObject), // Corrected
    );
  }

  async findAllByCompanyIdWithPagination({
    companyId,
    paginationOptions,
  }: {
    companyId: Company['id'];
    paginationOptions: IPaginationOptions;
  }): Promise<Subscription[]> {
    const entityObjects = await this.subscriptionModel
      .find({
        'company._id': companyId.toString(), // Assuming company is embedded and has an _id field
        deletedAt: null,
      })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      SubscriptionMapper.toDomain(entityObject),
    );
  }

  async findById(id: Subscription['id']): Promise<NullableType<Subscription>> {
    // Corrected
    const entityObject = await this.subscriptionModel.findById(id.toString()); // Corrected
    return entityObject ? SubscriptionMapper.toDomain(entityObject) : null; // Corrected
  }

  async findByIds(ids: Subscription['id'][]): Promise<Subscription[]> {
    // Corrected
    const entityObjects = await this.subscriptionModel.find({
      _id: { $in: ids.map((id) => id.toString()) },
    });
    return entityObjects.map(
      (entityObject) => SubscriptionMapper.toDomain(entityObject), // Corrected
    );
  }

  async findActiveSubscriptionByCompanyId(
    id: Company['id'],
  ): Promise<NullableType<Subscription>> {
    const entityObject = await this.subscriptionModel.findOne({
      'company._id': id.toString(),
      status: SubscriptionStatusEnum.ACTIVE,
    });
    return entityObject ? SubscriptionMapper.toDomain(entityObject) : null;
  }

  async update(
    id: Subscription['id'], // Corrected
    payload: Partial<Subscription>, // Corrected
  ): Promise<NullableType<Subscription>> {
    // Corrected
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.subscriptionModel.findOne(filter); // Corrected

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.subscriptionModel.findOneAndUpdate(
      // Corrected
      filter,
      SubscriptionMapper.toPersistence({
        // Corrected
        ...SubscriptionMapper.toDomain(entity), // Corrected
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? SubscriptionMapper.toDomain(entityObject) : null; // Corrected
  }

  async remove(id: Subscription['id']): Promise<void> {
    // Corrected
    await this.subscriptionModel.deleteOne({ _id: id.toString() }); // Corrected
  }
}
