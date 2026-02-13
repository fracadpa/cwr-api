import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CwrCapacityEnum } from '../../../../domain/cwr-capacity.enum';

@Entity({ name: 'ip_capacities' })
export class IpCapacityEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  name: string;

  @Column({ type: String, unique: true })
  code: string;

  @Column({ type: 'enum', enum: CwrCapacityEnum })
  cwrCapacity: CwrCapacityEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
