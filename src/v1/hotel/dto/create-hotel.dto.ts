import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateHotelDto {
  @IsString({ message: 'Hotel name must be a string' })
  @IsNotEmpty({ message: 'Hotel name is required' })
  @MaxLength(150, { message: 'Hotel name must not exceed 150 characters' })
  @ApiProperty()
  name!: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @ApiPropertyOptional()
  description?: string;

  @IsLatitude({ message: 'Latitude must be a valid latitude value' })
  @ApiProperty({ example: '16.84090000' })
  latitude!: string;

  @IsLongitude({ message: 'Longitude must be a valid longitude value' })
  @ApiProperty({ example: '96.17350000' })
  longitude!: string;

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  @ApiProperty()
  address!: string;

  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City is required' })
  @ApiProperty()
  city!: string;

  @IsString({ message: 'Country must be a string' })
  @IsNotEmpty({ message: 'Country is required' })
  @ApiProperty()
  country!: string;

  @IsString({ message: 'Postal code must be a string' })
  @IsNotEmpty({ message: 'Postal code is required' })
  @ApiProperty()
  postalCode!: string;

  @IsString({ message: 'Check-in time must be a string' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'Check-in time must be in HH:mm or HH:mm:ss format',
  })
  @ApiProperty({ example: '14:00' })
  checkInTime!: string;

  @IsString({ message: 'Check-out time must be a string' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'Check-out time must be in HH:mm or HH:mm:ss format',
  })
  @ApiProperty({ example: '12:00' })
  checkOutTime!: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (value === 'true' || value === '1' || value === true) return true;
    if (value === 'false' || value === '0' || value === false) return false;
    return value;
  })
  @IsBoolean({ message: 'Active status must be a boolean' })
  @ApiPropertyOptional({ default: true })
  isActive?: boolean;
}
