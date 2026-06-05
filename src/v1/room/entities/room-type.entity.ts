import { Hotel } from 'src/v1/hotel/entities/hotel.entity';
import { Room } from './room.entity';
import { RoomTypeCharacteristic } from './room-type-characteristic.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { RateOption } from 'src/v1/rate-option/entities/rate-option.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('room_types')
export class RoomType extends BaseEntity {
  @Column({ type: 'uuid' })
  hotelId!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'int' })
  maxOccupancy!: number;

  @Column()
  bedType!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  areaInSquareFeet!: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.roomTypes, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'hotelId' })
  hotel!: Relation<Hotel>;

  @OneToMany(() => Room, (room) => room.roomType)
  rooms!: Room[];

  @OneToMany(() => RateOption, (rateOption) => rateOption.roomType)
  rateOptions!: RateOption[];

  @OneToMany(
    () => RoomTypeCharacteristic,
    (roomTypeCharacteristic) => roomTypeCharacteristic.roomType,
  )
  roomTypeCharacteristics!: RoomTypeCharacteristic[];
}
