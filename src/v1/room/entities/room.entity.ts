import { AuditEntity } from 'src/common/entities/audit.entity';
import { Hotel } from 'src/v1/hotel/entities/hotel.entity';
import { RoomType } from './room-type.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BookingRoom } from 'src/v1/booking/entities/booking-room.entity';

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

@Entity('rooms')
@Index(['hotelId', 'roomNumber'], { unique: true })
export class Room extends AuditEntity {
  @Column({ type: 'uuid' })
  hotelId!: string;

  @Column({ type: 'uuid' })
  roomTypeId!: string;

  @Column()
  roomNumber!: string;

  @Column({ type: 'int' })
  floorNumber!: number;

  @Column({ type: 'enum', enum: RoomStatus })
  status!: RoomStatus;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'hotelId' })
  hotel!: Hotel;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'roomTypeId' })
  roomType!: RoomType;

  @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.room)
  bookingRooms!: BookingRoom[];
}
