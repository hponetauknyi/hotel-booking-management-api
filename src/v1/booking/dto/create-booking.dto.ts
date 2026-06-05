import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class BookingRoomItemDto {
  @IsUUID('4', { message: 'Room ID must be a valid UUID' })
  @ApiProperty()
  roomId!: string;

  @IsUUID('4', { message: 'Rate option ID must be a valid UUID' })
  @ApiProperty()
  rateOptionId!: string;

  @IsDateString(
    {},
    { message: 'Check-in date must be a valid ISO date (YYYY-MM-DD)' },
  )
  @ApiProperty({ example: '2025-09-01' })
  checkInDate!: string;

  @IsDateString(
    {},
    { message: 'Check-out date must be a valid ISO date (YYYY-MM-DD)' },
  )
  @ApiProperty({ example: '2025-09-05' })
  checkOutDate!: string;

  @IsInt({ message: 'Guest count must be an integer' })
  @Min(1, { message: 'Guest count must be at least 1' })
  @ApiProperty({ example: 2 })
  guestCount!: number;
}

export class CreateBookingDto {
  @IsArray({ message: 'Rooms must be an array' })
  @ArrayNotEmpty({ message: 'At least one room is required' })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BookingRoomItemDto)
  @ApiProperty({ type: [BookingRoomItemDto] })
  rooms!: BookingRoomItemDto[];
}
