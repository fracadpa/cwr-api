import { IpCapacity } from '@app/ip-capacities/domain/ip-capacity';
import { Company } from '@app/companies/domain/companies';
import { Tenant } from '@app/tenants/domain/tenants';
import { ControlledComposerEnum } from './controlled-composer.enum';

export class Composer {
  id: number;
  name: string;
  code: string;
  controlledComposer: ControlledComposerEnum;
  ipiComposer?: string | null;
  composerAlias?: string | null;
  ipCapacity: IpCapacity;
  company: Company;
  tenant: Tenant;
  createdAt: Date;
  updatedAt: Date;
}
