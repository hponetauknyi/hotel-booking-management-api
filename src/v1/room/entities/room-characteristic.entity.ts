import { AuditEntity } from 'src/common/entities/audit.entity';
import { RoomTypeCharacteristic } from './room-type-characteristic.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('room_characteristics')
export class RoomCharacteristic extends AuditEntity {
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
