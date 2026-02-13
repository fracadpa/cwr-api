import { Module } from '@nestjs/common';
import { SubscriptionRepository } from '../subscription.repository'; // Corrected
import { SubscriptionRelationalRepository } from './repositories/subscription.repository'; // Corrected
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity'; // Corrected

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity])], // Corrected
  providers: [
    {
      provide: SubscriptionRepository, // Corrected
      useClass: SubscriptionRelationalRepository, // Corrected
    },
  ],
  exports: [SubscriptionRepository], // Corrected
})
export class RelationalSubscriptionPersistenceModule {} // Corrected
