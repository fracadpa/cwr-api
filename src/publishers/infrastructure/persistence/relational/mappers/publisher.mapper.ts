import { Publisher } from '../../../../domain/publisher';
import { PublisherEntity } from '../entities/publisher.entity';
import { IpCapacity } from '../../../../../ip-capacities/domain/ip-capacity';
import { Company } from '../../../../../companies/domain/companies';
import { Tenant } from '../../../../../tenants/domain/tenants';

export class PublisherMapper {
  static toDomain(raw: PublisherEntity): Publisher {
    const domainEntity = new Publisher();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.code = raw.code;
    domainEntity.controlledPublisher = raw.controlledPublisher;
    domainEntity.ipiNumber = raw.ipiNumber;

    if (raw.ipCapacity) {
      const ipCapacity = new IpCapacity();
      ipCapacity.id = raw.ipCapacity.id;
      ipCapacity.name = raw.ipCapacity.name;
      ipCapacity.code = raw.ipCapacity.code;
      ipCapacity.cwrCapacity = raw.ipCapacity.cwrCapacity;
      ipCapacity.createdAt = raw.ipCapacity.createdAt;
      ipCapacity.updatedAt = raw.ipCapacity.updatedAt;
      domainEntity.ipCapacity = ipCapacity;
    }

    if (raw.company) {
      const company = new Company();
      company.id = raw.company.id;
      company.name = raw.company.name;
      company.createdAt = raw.company.createdAt;
      company.updatedAt = raw.company.updatedAt;
      domainEntity.company = company;
    }

    if (raw.tenant) {
      const tenant = new Tenant();
      tenant.id = raw.tenant.id;
      tenant.name = raw.tenant.name;
      tenant.createdAt = raw.tenant.createdAt;
      tenant.updatedAt = raw.tenant.updatedAt;
      domainEntity.tenant = tenant;
    }

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Publisher): PublisherEntity {
    const persistenceEntity = new PublisherEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.code = domainEntity.code;
    persistenceEntity.controlledPublisher = domainEntity.controlledPublisher;
    persistenceEntity.ipiNumber = domainEntity.ipiNumber;

    if (domainEntity.ipCapacity) {
      persistenceEntity.ipCapacity = domainEntity.ipCapacity as any;
    }
    if (domainEntity.company) {
      persistenceEntity.company = domainEntity.company as any;
    }
    if (domainEntity.tenant) {
      persistenceEntity.tenant = domainEntity.tenant as any;
    }

    if (domainEntity.createdAt) {
      persistenceEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      persistenceEntity.updatedAt = domainEntity.updatedAt;
    }

    return persistenceEntity;
  }
}
