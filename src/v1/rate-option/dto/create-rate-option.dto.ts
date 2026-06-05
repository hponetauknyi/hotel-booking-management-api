import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { CancellationPolicy, Currency } from '../entities/rate-option.entity';

const DEADLINE_REQUIRED_POLICIES = [
  CancellationPolicy.FREE_CANCELLATION_UNTIL_DEADLINE,
  CancellationPolicy.PARTIAL_REFUND_WITHIN_WINDOW,
];

export class CreateRateOptionDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(150, { message: 'Name must not exceed 150 characters' })
  @ApiProperty({ example: 'Flexible Rate' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @ApiPropertyOptional()
  description?: string;

  @IsNumber({}, { message: 'Price per night must be a number' })
  @Min(0, { message: 'Price per night must be at least 0' })
  @ApiProperty({ example: 120.0 })
  pricePerNight!: number;

  @IsEnum(Currency, {
    message: `Currency must be one of: ${Object.values(Currency).join(', ')}`,
  })
  @ApiProperty({ enum: Currency, example: Currency.USD })
  currency!: Currency;

  @IsBoolean({ message: 'isRefundable must be a boolean' })
  @ApiProperty({ example: true })
  isRefundable!: boolean;

  @IsEnum(CancellationPolicy, {
    message: `Cancellation policy must be one of: ${Object.values(CancellationPolicy).join(', ')}`,
  })
  @ApiProperty({ enum: CancellationPolicy })
  cancellationPolicy!: CancellationPolicy;

  @ValidateIf((o) => DEADLINE_REQUIRED_POLICIES.includes(o.cancellationPolicy))
  @IsInt({ message: 'deadlineHours must be an integer' })
  @Min(1, { message: 'deadlineHours must be at least 1' })
  @ApiPropertyOptional({
    example: 48,
    description: `Required when cancellationPolicy is ${DEADLINE_REQUIRED_POLICIES.join(' or ')}`,
  })
  deadlineHours?: number | null;
}
