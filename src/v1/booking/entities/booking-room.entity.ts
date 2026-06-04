import { RateOption } from 'src/v1/rate-option/entities/rate-option.entity';
import { Room } from 'src/v1/room/entities/room.entity';
import { Booking } from './booking.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('booking_rooms')
export class BookingRoom {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  bookingId!: string;

  @Column({ type: 'uuid' })
  roomId!: string;

  @Column({ type: 'uuid' })
  rateOptionId!: string;

  @Column({ type: 'date' })
  checkInDate!: string;

  @Column({ type: 'date' })
  checkOutDate!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  roomPricePerNight!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  roomTotalPrice!: string;

  @Column({ type: 'int' })
  guestCount!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => Booking, (booking) => booking.bookingRooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId' })
  booking!: Booking;

  @ManyToOne(() => Room, (room) => room.bookingRooms, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'roomId' })
  room!: Room;

  @ManyToOne(() => RateOption, (rateOption) => rateOption.bookingRooms, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'rateOptionId' })
  rateOption!: RateOption;
}
