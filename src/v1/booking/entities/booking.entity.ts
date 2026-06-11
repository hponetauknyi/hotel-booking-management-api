import { BaseEntity } from 'src/common/entities/base.entity';
import { Payment } from 'src/v1/payment/entities/payment.entity';
import { User } from 'src/v1/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { BookingRoom } from './booking-room.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
}

@Entity('bookings')
export class Booking extends BaseEntity {
  @Index({ unique: true })
  @Column()
  bookingReference!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'enum', enum: BookingStatus })
  status!: BookingStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice!: string;

  @Column({ type: 'int' })
  totalGuest!: number;

  @Column({ type: 'timestamptz' })
  bookedAt!: Date;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.booking)
  bookingRooms!: BookingRoom[];

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments!: Relation<Payment[]>;
}
