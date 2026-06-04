import { Module } from '@nestjs/common';
import { HotelController } from './controllers/hotel.controller';
import { HotelService } from './services/hotel.service';

@Module({
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
