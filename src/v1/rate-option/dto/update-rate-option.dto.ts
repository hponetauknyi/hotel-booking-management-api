import { PartialType } from '@nestjs/swagger';
import { CreateRateOptionDto } from './create-rate-option.dto';

export class UpdateRateOptionDto extends PartialType(CreateRateOptionDto) {}
