import { AuditEntity } from 'src/common/entities/audit.entity';
import { User } from 'src/v1/user/entities/user.entity';
import { BookingRoom } from './booking-room.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
}

@Entity('bookings')
export class Booking extends AuditEntity {
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
}
