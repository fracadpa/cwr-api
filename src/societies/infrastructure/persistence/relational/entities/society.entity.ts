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
import { CwrVersionEnum } from '../../../../domain/cwr-version.enum';

@Entity({ name: 'societies' })
export class SocietyEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  name: string;

  @Column({ type: 'integer', nullable: true })
  cwrSocietyId: number | null;

  @ManyToOne(() => SocietyEntity, { nullable: true })
  @JoinColumn({ name: 'cwrSocietyId' })
  cwrSociety: SocietyEntity | null;

  @Column({ type: 'enum', enum: CwrVersionEnum })
  cwrVer: CwrVersionEnum;

  @Column({ type: String, unique: true })
  cisacCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
