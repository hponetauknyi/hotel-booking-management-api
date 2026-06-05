import { RoomTypeCharacteristic } from './room-type-characteristic.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('room_characteristics')
export class RoomCharacteristic extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @OneToMany(
    () => RoomTypeCharacteristic,
    (roomTypeCharacteristic) => roomTypeCharacteristic.roomCharacteristic,
  )
  roomTypeCharacteristics!: RoomTypeCharacteristic[];
}
