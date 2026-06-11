import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { PaymentStatus } from '../entities/payment.entity';

export class FilterPaymentDto extends PaginationFilterDto {
  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Invalid payment status' })
  @ApiPropertyOptional({ enum: PaymentStatus })
  status?: PaymentStatus;

  @IsOptional()
  @IsUUID('4')
  @ApiPropertyOptional({ description: 'Filter by user ID (admin only)' })
  userId?: string;

  @IsOptional()
  @IsUUID('4')
  @ApiPropertyOptional({ description: 'Filter by booking ID' })
  bookingId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: 'createdAt' })
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
