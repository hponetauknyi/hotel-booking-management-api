import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class PatchBookingStatusDto {
  @IsEnum(BookingStatus, {
    message: `Status must be one of: ${Object.values(BookingStatus).join(', ')}`,
  })
  @ApiProperty({ enum: BookingStatus })
  status!: BookingStatus;
}
