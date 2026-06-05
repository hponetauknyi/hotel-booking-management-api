import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { BookingStatus } from '../entities/booking.entity';

export class FilterBookingDto extends PaginationFilterDto {
  @IsOptional()
  @IsEnum(BookingStatus, { message: 'Invalid booking status' })
  @ApiPropertyOptional({ enum: BookingStatus })
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: 'bookedAt' })
  sortBy?: string = 'bookedAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
