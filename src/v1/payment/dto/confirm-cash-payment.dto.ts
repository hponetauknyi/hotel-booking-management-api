import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ConfirmCashPaymentDto {
  @IsUUID('4', { message: 'Booking ID must be a valid UUID' })
  @ApiProperty({
    description: 'The PENDING booking to confirm via cash payment',
  })
  bookingId!: string;
}
