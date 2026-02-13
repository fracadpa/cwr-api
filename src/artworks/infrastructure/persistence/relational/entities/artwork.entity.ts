import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CompanyEntity } from '../../../../../companies/infrastructure/persistence/relational/entities/company.entity';
import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity({ name: 'artwork' })
export class ArtworkEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String })
  title: string;

  @Column({ type: String, nullable: true })
  artist: string | null;

  @Column({ type: 'int', nullable: true })
  year: number | null;

  @Column({ type: String, nullable: true })
  medium: string | null;

  @Column({ type: String, nullable: true })
  dimensions: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number | null;

  @Column({ type: String, nullable: true })
  imageUrl: string | null;

  @ManyToOne(() => CompanyEntity)
  company: CompanyEntity;

  @ManyToOne(() => TenantEntity)
  tenant: TenantEntity;

  @ManyToOne(() => UserEntity)
  createdBy: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
