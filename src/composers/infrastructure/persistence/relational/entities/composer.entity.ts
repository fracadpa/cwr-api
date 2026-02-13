import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '@app/utils/relational-entity-helper';
import { ControlledComposerEnum } from '../../../../domain/controlled-composer.enum';
import { IpCapacityEntity } from '@app/ip-capacities/infrastructure/persistence/relational/entities/ip-capacity.entity';
import { CompanyEntity } from '@app/companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '@app/tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Entity({
  name: 'composers',
})
export class ComposerEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: ControlledComposerEnum,
    name: 'controlled_composer',
  })
  controlledComposer: ControlledComposerEnum;

  @Column({ nullable: true, name: 'ipi_composer', type: String })
  ipiComposer: string | null;

  @Column({ nullable: true, name: 'composer_alias', type: String })
  composerAlias: string | null;

  @ManyToOne(() => IpCapacityEntity, { eager: true })
  @JoinColumn({ name: 'ip_capacity_id' })
  ipCapacity: IpCapacityEntity;

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
