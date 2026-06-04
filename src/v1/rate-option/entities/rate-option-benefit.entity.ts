import { Benefit } from './benefit.entity';
import { RateOption } from './rate-option.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rate_option_benefits')
@Index(['rateOptionId', 'benefitId'], { unique: true })
export class RateOptionBenefit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  rateOptionId!: string;

  @Column({ type: 'uuid' })
  benefitId!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => RateOption, (rateOption) => rateOption.rateOptionBenefits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rateOptionId' })
  rateOption!: RateOption;

  @ManyToOne(() => Benefit, (benefit) => benefit.rateOptionBenefits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'benefitId' })
  benefit!: Benefit;
}
