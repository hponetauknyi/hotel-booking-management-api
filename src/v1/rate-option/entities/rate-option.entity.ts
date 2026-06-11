import { BaseEntity } from 'src/common/entities/base.entity';
import { Currency } from 'src/common/enums/currency.enum';
import { BookingRoom } from 'src/v1/booking/entities/booking-room.entity';
import { RoomType } from 'src/v1/room/entities/room-type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { RateOptionBenefit } from './rate-option-benefit.entity';

export enum CancellationPolicy {
  FREE_CANCELLATION = 'FREE_CANCELLATION',
  FREE_CANCELLATION_UNTIL_DEADLINE = 'FREE_CANCELLATION_UNTIL_DEADLINE',
  NON_REFUNDABLE = 'NON_REFUNDABLE',
  PARTIAL_REFUND_WITHIN_WINDOW = 'PARTIAL_REFUND_WITHIN_WINDOW',
  FEE_BASED_CANCELLATION = 'FEE_BASED_CANCELLATION',
}

@Entity('rate_options')
export class RateOption extends BaseEntity {
  @Column({ type: 'uuid' })
  roomTypeId!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  pricePerNight!: string;

  @Column({ type: 'enum', enum: Currency, default: Currency.USD })
  currency!: Currency;

  @Column({ default: false })
  isRefundable!: boolean;

  @Column({ type: 'enum', enum: CancellationPolicy })
  cancellationPolicy!: CancellationPolicy;

  @Column({ type: 'int', nullable: true })
  deadlineHours!: number | null;

  @ManyToOne(() => RoomType, (roomType) => roomType.rateOptions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'roomTypeId' })
  roomType!: Relation<RoomType>;

  @OneToMany(
    () => RateOptionBenefit,
    (rateOptionBenefit) => rateOptionBenefit.rateOption,
  )
  rateOptionBenefits!: RateOptionBenefit[];

  @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.rateOption)
  bookingRooms!: BookingRoom[];
}
