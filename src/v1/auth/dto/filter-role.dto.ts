import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';

export class FilterRoleDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  search?: string;
}
