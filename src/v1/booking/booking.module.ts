import { Module } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { BookingController } from './controllers/booking.controller';

@Module({
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
