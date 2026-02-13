import { Plan } from '../../../../domain/plans'; // Corrected
import { PlanSchemaClass } from '../entities/plan.schema'; // Corrected

export class PlanMapper {
  // Corrected
  public static toDomain(raw: PlanSchemaClass): Plan {
    // Corrected
    const domainEntity = new Plan(); // Corrected
    domainEntity.id = Number(raw._id);
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Plan): PlanSchemaClass {
    // Corrected
    const persistenceSchema = new PlanSchemaClass(); // Corrected
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id.toString();
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
