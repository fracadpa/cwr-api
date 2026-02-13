import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '@app/utils/relational-entity-helper';
import { PublisherAffiliationEntity } from '@app/publisher-affiliations/infrastructure/persistence/relational/entities/publisher-affiliation.entity';
import { TerritoryEntity } from '@app/territories/infrastructure/persistence/relational/entities/territory.entity';
import { CompanyEntity } from '@app/companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '@app/tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Entity({
  name: 'publisher_territories',
})
export class PublisherAffiliationTerritoryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PublisherAffiliationEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'publisher_affiliation_id' })
  publisherAffiliation: PublisherAffiliationEntity;

  @ManyToOne(() => TerritoryEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'territory_id' })
  territory: TerritoryEntity;

  @ManyToOne(() => CompanyEntity, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @ManyToOne(() => TenantEntity, { eager: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
