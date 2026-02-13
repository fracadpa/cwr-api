import { Module } from '@nestjs/common';
import { PublisherAffiliationsService } from '@app/publisher-affiliations/publisher-affiliations.service';
import { PublisherAffiliationsController } from '@app/publisher-affiliations/publisher-affiliations.controller';
import { RelationalPublisherAffiliationPersistenceModule } from '@app/publisher-affiliations/infrastructure/persistence/relational/relational-persistence.module';
import { SocietiesModule } from '@app/societies/societies.module';
import { PublishersModule } from '@app/publishers/publishers.module';

@Module({
  imports: [
    RelationalPublisherAffiliationPersistenceModule,
    PublishersModule,
    SocietiesModule,
  ],
  controllers: [PublisherAffiliationsController],
  providers: [PublisherAffiliationsService],
  exports: [PublisherAffiliationsService],
})
export class PublisherAffiliationsModule {}
