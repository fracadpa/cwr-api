import { Company } from '../../../../domain/companies'; // Corrected
import { CompanySchemaClass } from '../entities/company.schema'; // Corrected

export class CompanyMapper {
  // Corrected
  public static toDomain(raw: CompanySchemaClass): Company {
    // Corrected
    const domainEntity = new Company(); // Corrected
    domainEntity.id = Number(raw._id);
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Company): CompanySchemaClass {
    // Corrected
    const persistenceSchema = new CompanySchemaClass(); // Corrected
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id.toString();
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
