import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherAffiliationEntity } from '@app/publisher-affiliations/infrastructure/persistence/relational/entities/publisher-affiliation.entity';
import { PublisherAffiliationRepository } from '@app/publisher-affiliations/infrastructure/persistence/publisher-affiliation.repository';
import { PublisherAffiliationRelationalRepository } from '@app/publisher-affiliations/infrastructure/persistence/relational/repositories/publisher-affiliation.repository';
import { PublisherEntity } from '@app/publishers/infrastructure/persistence/relational/entities/publisher.entity';
import { SocietyEntity } from '@app/societies/infrastructure/persistence/relational/entities/society.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PublisherAffiliationEntity,
      PublisherEntity,
      SocietyEntity,
    ]),
  ],
  providers: [
    {
      provide: PublisherAffiliationRepository,
      useClass: PublisherAffiliationRelationalRepository,
    },
  ],
  exports: [PublisherAffiliationRepository],
})
export class RelationalPublisherAffiliationPersistenceModule {}
