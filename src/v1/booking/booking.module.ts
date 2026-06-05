import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateOption } from 'src/v1/rate-option/entities/rate-option.entity';
import { Room } from 'src/v1/room/entities/room.entity';
import { BookingController } from './controllers/booking.controller';
import { BookingRoom } from './entities/booking-room.entity';
import { Booking } from './entities/booking.entity';
import { BookingService } from './services/booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, BookingRoom, Room, RateOption])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
