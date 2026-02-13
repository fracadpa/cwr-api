import { PublisherAffiliation } from '@app/publisher-affiliations/domain/publisher-affiliation';
import { Territory } from '@app/territories/domain/territory';

export class PublisherAffiliationTerritory {
  id: number;
  publisherAffiliation: PublisherAffiliation;
  territory: Territory;
  createdAt: Date;
  updatedAt: Date;
}
