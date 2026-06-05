import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/v1/hotel/entities/hotel.entity';
import { RoomTypeController } from './controllers/room-type.controller';
import { RoomController } from './controllers/room.controller';
import { RoomCharacteristic } from './entities/room-characteristic.entity';
import { RoomTypeCharacteristic } from './entities/room-type-characteristic.entity';
import { RoomType } from './entities/room-type.entity';
import { Room } from './entities/room.entity';
import { RoomTypeService } from './services/room-type.service';
import { RoomService } from './services/room.service';
import { RoomCharacteristicController } from './controllers/room-characteristic.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Room,
      RoomType,
      RoomCharacteristic,
      RoomTypeCharacteristic,
      Hotel,
    ]),
  ],
  controllers: [
    RoomController,
    RoomTypeController,
    RoomCharacteristicController,
  ],
  providers: [RoomService, RoomTypeService],
  exports: [RoomService, RoomTypeService],
})
export class RoomModule {}
