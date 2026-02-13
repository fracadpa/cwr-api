import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { SubscriptionEntity } from '../../../../../subscriptions/infrastructure/persistence/relational/entities/subscription.entity';
import { CompanyEntity } from '../../../../../companies/infrastructure/persistence/relational/entities/company.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.provider = raw.provider;
    domainEntity.socialId = raw.socialId;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    if (raw.photo) {
      domainEntity.photo = FileMapper.toDomain(raw.photo);
    }
    domainEntity.role = raw.role;
    domainEntity.status = raw.status;
    domainEntity.tenant = raw.tenant;
    domainEntity.activeSubscription = raw.activeSubscription;
    domainEntity.company = raw.company;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
    const persistenceEntity = new UserEntity(); // Declared once here
    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.password = domainEntity.password;
    persistenceEntity.provider = domainEntity.provider;
    persistenceEntity.socialId = domainEntity.socialId;
    persistenceEntity.firstName = domainEntity.firstName;
    persistenceEntity.lastName = domainEntity.lastName;

    let role: RoleEntity | undefined = undefined;

    if (domainEntity.role) {
      role = new RoleEntity();
      role.id = Number(domainEntity.role.id);
    }
    persistenceEntity.role = role;

    let photo: FileEntity | undefined | null = undefined;

    if (domainEntity.photo) {
      photo = new FileEntity();
      photo.id = domainEntity.photo.id;
      photo.path = domainEntity.photo.path;
    } else if (domainEntity.photo === null) {
      photo = null;
    }
    persistenceEntity.photo = photo;

    let status: StatusEntity | undefined = undefined;

    if (domainEntity.status) {
      status = new StatusEntity();
      status.id = Number(domainEntity.status.id);
    }
    persistenceEntity.status = status;

    // Handle tenant assignment
    if (domainEntity.tenant) {
      const tenantEntity = new TenantEntity();
      tenantEntity.id = domainEntity.tenant.id;
      persistenceEntity.tenant = tenantEntity;
    }

    // Handle activeSubscription assignment
    if (domainEntity.activeSubscription) {
      const subscriptionEntity = new SubscriptionEntity();
      subscriptionEntity.id = domainEntity.activeSubscription.id;
      persistenceEntity.activeSubscription = subscriptionEntity;
    } else if (domainEntity.activeSubscription === null) {
      persistenceEntity.activeSubscription = null;
    }

    // Handle company assignment
    if (domainEntity.company) {
      const companyEntity = new CompanyEntity();
      companyEntity.id = domainEntity.company.id;
      persistenceEntity.company = companyEntity;
    }

    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
