import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubscriptionSchema, // Corrected
  SubscriptionSchemaClass, // Corrected
} from './entities/subscription.schema'; // Corrected
import { SubscriptionRepository } from '../subscription.repository'; // Corrected
import { SubscriptionDocumentRepository } from './repositories/subscription.repository'; // Corrected

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionSchemaClass.name, schema: SubscriptionSchema }, // Corrected
    ]),
  ],
  providers: [
    {
      provide: SubscriptionRepository, // Corrected
      useClass: SubscriptionDocumentRepository, // Corrected
    },
  ],
  exports: [SubscriptionRepository], // Corrected
})
export class DocumentSubscriptionPersistenceModule {} // Corrected
