import { AuditEntity } from 'src/common/entities/audit.entity';
import { RateOptionBenefit } from './rate-option-benefit.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('benefits')
export class Benefit extends AuditEntity {
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
