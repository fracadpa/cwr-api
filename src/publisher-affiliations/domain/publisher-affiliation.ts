import { Publisher } from '@app/publishers/domain/publisher';
import { Society } from '@app/societies/domain/society';

export class PublisherAffiliation {
  id: number;
  publisher: Publisher;
  publicSociety: Society;
  mechanicalSociety: Society;
  createdAt: Date;
  updatedAt: Date;
}
