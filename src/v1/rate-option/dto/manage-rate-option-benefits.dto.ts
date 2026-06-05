import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class ManageRateOptionBenefitsDto {
  @IsArray({ message: 'Benefit IDs must be an array' })
  @ArrayNotEmpty({ message: 'Benefit IDs must not be empty' })
  @ArrayMinSize(1, { message: 'At least one benefit ID is required' })
  @IsUUID('4', { each: true, message: 'Each benefit ID must be a valid UUID' })
  @ApiProperty({ type: [String] })
  benefitIds!: string[];
}
