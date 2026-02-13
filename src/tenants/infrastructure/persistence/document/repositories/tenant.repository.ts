import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TenantSchemaClass } from '../entities/tenant.schema'; // Corrected
import { TenantRepository } from '../../tenant.repository'; // Corrected
import { Tenant } from '../../../../domain/tenants'; // Corrected
import { TenantMapper } from '../mappers/tenant.mapper'; // Corrected
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Company } from '../../../../../companies/domain/companies'; // Import Company

@Injectable()
export class TenantDocumentRepository implements TenantRepository {
  // Corrected
  constructor(
    @InjectModel(TenantSchemaClass.name)
    private readonly tenantModel: Model<TenantSchemaClass>, // Corrected
  ) {}

  async create(data: Tenant): Promise<Tenant> {
    // Corrected
    const persistenceModel = TenantMapper.toPersistence(data); // Corrected
    const createdEntity = new this.tenantModel(persistenceModel); // Corrected
    const entityObject = await createdEntity.save();
    return TenantMapper.toDomain(entityObject); // Corrected
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tenant[]> {
    // Corrected
    const entityObjects = await this.tenantModel // Corrected
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map(
      (entityObject) => TenantMapper.toDomain(entityObject), // Corrected
    );
  }

  async findById(id: Tenant['id']): Promise<NullableType<Tenant>> {
    // Corrected
    const entityObject = await this.tenantModel.findById(id); // Corrected
    return entityObject ? TenantMapper.toDomain(entityObject) : null; // Corrected
  }

  async findByIds(ids: Tenant['id'][]): Promise<Tenant[]> {
    // Corrected
    const entityObjects = await this.tenantModel.find({ _id: { $in: ids } }); // Corrected
    return entityObjects.map(
      (entityObject) => TenantMapper.toDomain(entityObject), // Corrected
    );
  }

  async update(
    id: Tenant['id'], // Corrected
    payload: Partial<Tenant>, // Corrected
  ): Promise<NullableType<Tenant>> {
    // Corrected
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.tenantModel.findOne(filter); // Corrected

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.tenantModel.findOneAndUpdate(
      // Corrected
      filter,
      TenantMapper.toPersistence({
        // Corrected
        ...TenantMapper.toDomain(entity), // Corrected
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? TenantMapper.toDomain(entityObject) : null; // Corrected
  }

  async remove(id: Tenant['id']): Promise<void> {
    // Corrected
    await this.tenantModel.deleteOne({ _id: id }); // Corrected
  }

  async findByCompanyId(
    companyId: Company['id'],
  ): Promise<NullableType<Tenant>> {
    const entityObject = await this.tenantModel.findOne({
      'company._id': companyId,
    });
    return entityObject ? TenantMapper.toDomain(entityObject) : null;
  }

  async findByName(
    name: string,
    companyId: number,
  ): Promise<NullableType<Tenant>> {
    const entityObject = await this.tenantModel.findOne({
      name,
      'company._id': companyId,
    });
    return entityObject ? TenantMapper.toDomain(entityObject) : null;
  }
}
