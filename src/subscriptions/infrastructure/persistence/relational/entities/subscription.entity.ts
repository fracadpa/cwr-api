import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn, // Import JoinColumn
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CompanyEntity } from '../../../../../companies/infrastructure/persistence/relational/entities/company.entity';
import { SubscriptionStatusEnum } from '../../../../domain/subscription-status.enum';
import { PlanEntity } from '../../../../../plans/infrastructure/persistence/relational/entities/plan.entity'; // Import PlanEntity

@Entity({
  name: 'subscription',
})
export class SubscriptionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SubscriptionStatusEnum,
    default: SubscriptionStatusEnum.INCOMPLETE,
  })
  status: SubscriptionStatusEnum;

  @ManyToOne(() => CompanyEntity, (company) => company.subscriptions)
  company: CompanyEntity;

  @ManyToOne(() => PlanEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'planId' }) // Add JoinColumn with name
  plan: PlanEntity;

  @Column({ type: 'integer', nullable: true })
  planId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
