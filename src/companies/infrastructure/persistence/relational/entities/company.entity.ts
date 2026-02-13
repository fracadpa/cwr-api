import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { SubscriptionEntity } from '../../../../../subscriptions/infrastructure/persistence/relational/entities/subscription.entity';

@Entity({
  name: 'company',
})
export class CompanyEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true })
  name: string;

  @OneToMany(() => TenantEntity, (tenant) => tenant.company)
  tenants: TenantEntity[];

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.company)
  subscriptions: SubscriptionEntity[];

  @OneToOne(() => SubscriptionEntity)
  @JoinColumn()
  activeSubscription: SubscriptionEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
