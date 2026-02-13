import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ControlledPublisherEnum } from '../../../../domain/controlled-publisher.enum';
import { IpCapacityEntity } from '../../../../../ip-capacities/infrastructure/persistence/relational/entities/ip-capacity.entity';
import { CompanyEntity } from '../../../../../companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Entity({ name: 'publishers' })
export class PublisherEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  name: string;

  @Column({ type: String, unique: true })
  code: string;

  @Column({ type: 'enum', enum: ControlledPublisherEnum })
  controlledPublisher: ControlledPublisherEnum;

  @Column({ type: String })
  ipiNumber: string;

  @ManyToOne(() => IpCapacityEntity, { eager: true })
  @JoinColumn({ name: 'ipCapacityId' })
  ipCapacity: IpCapacityEntity;

  @ManyToOne(() => CompanyEntity, { eager: true })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @ManyToOne(() => TenantEntity, { eager: true })
  @JoinColumn({ name: 'tenantId' })
  tenant: TenantEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
