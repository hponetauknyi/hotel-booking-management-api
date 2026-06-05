import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';

const toStringArray = (value: unknown): string[] | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export class FilterHotelDto extends PaginationFilterDto {
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  @ApiPropertyOptional()
  search?: string;

  @IsOptional()
  @IsBoolean({ message: 'Is active must be a boolean' })
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (value === 'true' || value === '1' || value === true) return true;
    if (value === 'false' || value === '0' || value === false) return false;
    return undefined;
  })
  @ApiPropertyOptional()
  isActive?: boolean;

  @IsOptional()
  @IsArray({ message: 'Room type IDs must be an array' })
  @IsUUID('4', {
    each: true,
    message: 'Room type IDs must be valid UUIDs',
  })
  @Transform(({ value }) => toStringArray(value))
  @ApiPropertyOptional({ type: [String] })
  roomTypeIds?: string[];

  @IsOptional()
  @IsArray({ message: 'Room characteristic IDs must be an array' })
  @IsUUID('4', {
    each: true,
    message: 'Room characteristic IDs must be valid UUIDs',
  })
  @Transform(({ value }) => toStringArray(value))
  @ApiPropertyOptional({ type: [String] })
  roomCharacteristicIds?: string[];

  @IsOptional()
  @IsArray({ message: 'Rate option IDs must be an array' })
  @IsUUID('4', {
    each: true,
    message: 'Rate option IDs must be valid UUIDs',
  })
  @Transform(({ value }) => toStringArray(value))
  @ApiPropertyOptional({ type: [String] })
  rateOptionIds?: string[];

  @IsOptional()
  @IsArray({ message: 'Rate option benefit IDs must be an array' })
  @IsUUID('4', {
    each: true,
    message: 'Rate option benefit IDs must be valid UUIDs',
  })
  @Transform(({ value }) => toStringArray(value))
  @ApiPropertyOptional({ type: [String] })
  rateOptionBenefitIds?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Min price must be a number' })
  @Min(0, { message: 'Min price must be at least 0' })
  @ApiPropertyOptional()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Max price must be a number' })
  @Min(0, { message: 'Max price must be at least 0' })
  @ApiPropertyOptional()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: 'createdAt' })
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
