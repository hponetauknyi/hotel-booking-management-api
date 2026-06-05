import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelController } from './controllers/hotel.controller';
import { Hotel } from './entities/hotel.entity';
import { HotelService } from './services/hotel.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel])],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
