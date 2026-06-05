import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRoomTypeDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(150, { message: 'Name must not exceed 150 characters' })
  @ApiProperty()
  name!: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @ApiPropertyOptional()
  description?: string;

  @IsInt({ message: 'Max occupancy must be an integer' })
  @Min(1, { message: 'Max occupancy must be at least 1' })
  @Max(20, { message: 'Max occupancy must not exceed 20' })
  @ApiProperty({ example: 2 })
  maxOccupancy!: number;

  @IsString({ message: 'Bed type must be a string' })
  @IsNotEmpty({ message: 'Bed type is required' })
  @ApiProperty({ example: 'King' })
  bedType!: string;

  @IsNumber({}, { message: 'Area in square feet must be a number' })
  @Min(1, { message: 'Area must be at least 1 sq ft' })
  @ApiProperty({ example: 350.5 })
  areaInSquareFeet!: number;

  @IsOptional()
  @IsArray({ message: 'Room characteristic IDs must be an array' })
  @IsUUID('4', {
    each: true,
    message: 'Each room characteristic ID must be a valid UUID',
  })
  @ApiPropertyOptional({
    type: [String],
    description: 'UUIDs of room characteristics to assign',
  })
  roomCharacteristicIds?: string[];
}
