import { RoomCharacteristic } from './room-characteristic.entity';
import { RoomType } from './room-type.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('room_type_characteristics')
@Index(['roomTypeId', 'roomCharacteristicId'], { unique: true })
export class RoomTypeCharacteristic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  roomTypeId!: string;

  @Column({ type: 'uuid' })
  roomCharacteristicId!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => RoomType, (roomType) => roomType.roomTypeCharacteristics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roomTypeId' })
  roomType!: Relation<RoomType>;

  @ManyToOne(
    () => RoomCharacteristic,
    (roomCharacteristic) => roomCharacteristic.roomTypeCharacteristics,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'roomCharacteristicId' })
  roomCharacteristic!: RoomCharacteristic;
}
