import { BaseEntity } from 'src/common/entities/base.entity';
import { BookingRoom } from 'src/v1/booking/entities/booking-room.entity';
import { Hotel } from 'src/v1/hotel/entities/hotel.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { RoomType } from './room-type.entity';

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

@Entity('rooms')
@Index(['hotelId', 'roomNumber'], { unique: true })
export class Room extends BaseEntity {
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
  hotel!: Relation<Hotel>;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'roomTypeId' })
  roomType!: Relation<RoomType>;

  @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.room)
  bookingRooms!: BookingRoom[];
}
