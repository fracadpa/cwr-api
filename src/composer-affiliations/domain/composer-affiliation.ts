import { Composer } from '@app/composers/domain/composer';
import { Society } from '@app/societies/domain/society';
import { Company } from '@app/companies/domain/companies';
import { Tenant } from '@app/tenants/domain/tenants';

export class ComposerAffiliation {
  id: number;
  composer: Composer;
  publicSociety: Society;
  mechanicalSociety: Society;
  company: Company;
  tenant: Tenant;
  createdAt: Date;
  updatedAt: Date;
}
