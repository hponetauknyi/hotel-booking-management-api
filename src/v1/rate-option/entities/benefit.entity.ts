import { RateOptionBenefit } from './rate-option-benefit.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('benefits')
export class Benefit extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @OneToMany(
    () => RateOptionBenefit,
    (rateOptionBenefit) => rateOptionBenefit.benefit,
  )
  rateOptionBenefits!: RateOptionBenefit[];
}
