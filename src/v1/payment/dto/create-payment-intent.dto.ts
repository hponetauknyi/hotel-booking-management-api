import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsUUID('4', { message: 'Booking ID must be a valid UUID' })
  @ApiProperty({ description: 'The booking to pay for' })
  bookingId!: string;
}
