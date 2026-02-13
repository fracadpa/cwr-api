import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanySchemaClass } from '../entities/company.schema'; // Corrected
import { CompanyRepository } from '../../company.repository'; // Corrected
import { Company } from '../../../../domain/companies'; // Corrected
import { CompanyMapper } from '../mappers/company.mapper'; // Corrected
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CompanyDocumentRepository implements CompanyRepository {
  // Corrected
  constructor(
    @InjectModel(CompanySchemaClass.name)
    private readonly companyModel: Model<CompanySchemaClass>, // Corrected
  ) {}

  async create(data: Company): Promise<Company> {
    // Corrected
    const persistenceModel = CompanyMapper.toPersistence(data); // Corrected
    const createdEntity = new this.companyModel(persistenceModel); // Corrected
    const entityObject = await createdEntity.save();
    return CompanyMapper.toDomain(entityObject); // Corrected
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Company[]> {
    // Corrected
    const entityObjects = await this.companyModel // Corrected
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map(
      (entityObject) => CompanyMapper.toDomain(entityObject), // Corrected
    );
  }

  async findById(id: Company['id']): Promise<NullableType<Company>> {
    // Corrected
    const entityObject = await this.companyModel.findById(id.toString()); // Corrected
    return entityObject ? CompanyMapper.toDomain(entityObject) : null; // Corrected
  }

  async findByIds(ids: Company['id'][]): Promise<Company[]> {
    // Corrected
    const entityObjects = await this.companyModel.find({
      _id: { $in: ids.map((id) => id.toString()) },
    }); // Corrected
    return entityObjects.map(
      (entityObject) => CompanyMapper.toDomain(entityObject), // Corrected
    );
  }

  async update(
    id: Company['id'], // Corrected
    payload: Partial<Company>, // Corrected
  ): Promise<NullableType<Company>> {
    // Corrected
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.companyModel.findOne(filter); // Corrected

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.companyModel.findOneAndUpdate(
      // Corrected
      filter,
      CompanyMapper.toPersistence({
        // Corrected
        ...CompanyMapper.toDomain(entity), // Corrected
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? CompanyMapper.toDomain(entityObject) : null; // Corrected
  }

  async remove(id: Company['id']): Promise<void> {
    // Corrected
    await this.companyModel.deleteOne({ _id: id.toString() }); // Corrected
  }

  async findByName(name: string): Promise<NullableType<Company>> {
    const entityObject = await this.companyModel.findOne({ name });
    return entityObject ? CompanyMapper.toDomain(entityObject) : null;
  }
}
