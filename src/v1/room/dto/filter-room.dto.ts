import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';

export class FilterRoomDto extends PaginationFilterDto {
  @IsOptional()
  @IsUUID('4', { message: 'Room type ID must be a valid UUID' })
  @ApiPropertyOptional({ description: 'Filter by room type ID' })
  roomTypeId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Min price must be a number' })
  @Min(0, { message: 'Min price must be at least 0' })
  @ApiPropertyOptional({ description: 'Filter by minimum rate option price' })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Max price must be a number' })
  @Min(0, { message: 'Max price must be at least 0' })
  @Max(1_000_000, { message: 'Max price must not exceed 1,000,000' })
  @ApiPropertyOptional({ description: 'Filter by maximum rate option price' })
  maxPrice?: number;
}
