import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '@app/utils/relational-entity-helper';
import { ComposerEntity } from '@app/composers/infrastructure/persistence/relational/entities/composer.entity';
import { SocietyEntity } from '@app/societies/infrastructure/persistence/relational/entities/society.entity';
import { CompanyEntity } from '@app/companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '@app/tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Entity({
  name: 'composer_affiliations',
})
export class ComposerAffiliationEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ComposerEntity, { eager: true })
  @JoinColumn({ name: 'composer_id' })
  composer: ComposerEntity;

  @ManyToOne(() => SocietyEntity, { eager: true })
  @JoinColumn({ name: 'public_society_id' })
  publicSociety: SocietyEntity;

  @ManyToOne(() => SocietyEntity, { eager: true })
  @JoinColumn({ name: 'mechanical_society_id' })
  mechanicalSociety: SocietyEntity;

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
