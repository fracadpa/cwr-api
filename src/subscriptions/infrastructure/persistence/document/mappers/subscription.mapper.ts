import { Subscription } from '../../../../domain/subscriptions'; // Corrected
import { SubscriptionSchemaClass } from '../entities/subscription.schema'; // Corrected

export class SubscriptionMapper {
  // Corrected
  public static toDomain(raw: SubscriptionSchemaClass): Subscription {
    // Corrected
    const domainEntity = new Subscription(); // Corrected
    domainEntity.id = Number(raw._id);
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: Subscription, // Corrected
  ): SubscriptionSchemaClass {
    // Corrected
    const persistenceSchema = new SubscriptionSchemaClass(); // Corrected
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id.toString();
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
