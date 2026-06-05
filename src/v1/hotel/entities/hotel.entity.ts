import { BaseEntity } from 'src/common/entities/base.entity';
import { Admin } from 'src/v1/admin/entities/admin.entity';
import { RoomType } from 'src/v1/room/entities/room-type.entity';
import { Room } from 'src/v1/room/entities/room.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';

@Entity('hotels')
export class Hotel extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude!: string;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude!: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  country!: string;

  @Column()
  postalCode!: string;

  @Column({ type: 'time' })
  checkInTime!: string;

  @Column({ type: 'time' })
  checkOutTime!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'uuid' })
  createdBy!: string;

  @ManyToOne(() => Admin, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'createdBy' })
  createdByAdmin!: Relation<Admin>;

  @OneToMany(() => RoomType, (roomType) => roomType.hotel)
  roomTypes!: RoomType[];

  @OneToMany(() => Room, (room) => room.hotel)
  rooms!: Room[];
}
