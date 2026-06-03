import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
  IsIn,
} from 'class-validator';
import { LogAction } from '../constants/log-action.enum';
import { LogStatus } from '../constants/log-status.enum';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';

export class FilterAuditLogDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  adminId?: string;

  @IsOptional()
  @IsEnum(LogAction)
  @ApiPropertyOptional({ enum: LogAction })
  action?: LogAction;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  entityName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  entityId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  device?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  location?: string;

  @IsOptional()
  @IsEnum(LogStatus)
  @ApiPropertyOptional({ enum: LogStatus })
  status?: LogStatus;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  endDate?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ default: 'createdAt' })
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
