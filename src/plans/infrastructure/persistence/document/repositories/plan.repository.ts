import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlanSchemaClass } from '../entities/plan.schema'; // Corrected
import { PlanRepository } from '../../plan.repository'; // Corrected
import { Plan } from '../../../../domain/plans'; // Corrected
import { PlanMapper } from '../mappers/plan.mapper'; // Corrected
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PlanDocumentRepository implements PlanRepository {
  // Corrected
  constructor(
    @InjectModel(PlanSchemaClass.name)
    private readonly planModel: Model<PlanSchemaClass>, // Corrected
  ) {}

  async create(data: Plan): Promise<Plan> {
    // Corrected
    const persistenceModel = PlanMapper.toPersistence(data); // Corrected
    const createdEntity = new this.planModel(persistenceModel); // Corrected
    const entityObject = await createdEntity.save();
    return PlanMapper.toDomain(entityObject); // Corrected
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Plan[]> {
    // Corrected
    const entityObjects = await this.planModel // Corrected
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map(
      (entityObject) => PlanMapper.toDomain(entityObject), // Corrected
    );
  }

  async findById(id: Plan['id']): Promise<NullableType<Plan>> {
    // Corrected
    const entityObject = await this.planModel.findById(id.toString()); // Corrected
    return entityObject ? PlanMapper.toDomain(entityObject) : null; // Corrected
  }

  async findByIds(ids: Plan['id'][]): Promise<Plan[]> {
    // Corrected
    const entityObjects = await this.planModel.find({
      _id: { $in: ids.map((id) => id.toString()) },
    }); // Corrected
    return entityObjects.map(
      (entityObject) => PlanMapper.toDomain(entityObject), // Corrected
    );
  }

  async findDefaultPlan(): Promise<NullableType<Plan>> {
    // Added method
    const entityObject = await this.planModel.findOne({ name: 'Free' }); // Corrected
    return entityObject ? PlanMapper.toDomain(entityObject) : null; // Corrected
  }

  async update(
    id: Plan['id'], // Corrected
    payload: Partial<Plan>, // Corrected
  ): Promise<NullableType<Plan>> {
    // Corrected
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.planModel.findOne(filter); // Corrected

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.planModel.findOneAndUpdate(
      // Corrected
      filter,
      PlanMapper.toPersistence({
        // Corrected
        ...PlanMapper.toDomain(entity), // Corrected
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? PlanMapper.toDomain(entityObject) : null; // Corrected
  }

  async remove(id: Plan['id']): Promise<void> {
    // Corrected
    await this.planModel.deleteOne({ _id: id.toString() }); // Corrected
  }
}
