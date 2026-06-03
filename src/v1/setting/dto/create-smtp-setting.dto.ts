import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSMTPDto {
  @IsString({ message: 'SMTP host must be a string' })
  @IsNotEmpty({ message: 'SMTP host is required' })
  @MaxLength(255, { message: 'SMTP host must not exceed 255 characters' })
  @ApiProperty()
  smtpHost!: string;

  @IsNumber({}, { message: 'SMTP port must be a valid port number' })
  @Transform(({ value }) => parseInt(value))
  @ApiProperty()
  smtpPort!: number;

  @IsBoolean({ message: 'SMTP secure must be a boolean value' })
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty()
  smtpSecure!: boolean;

  @IsString({ message: 'SMTP username must be a string' })
  @IsOptional()
  @MaxLength(255, { message: 'SMTP username must not exceed 255 characters' })
  @ApiPropertyOptional()
  smtpUsername?: string;

  @IsString({ message: 'SMTP password must be a string' })
  @IsOptional()
  @MaxLength(255, { message: 'SMTP password must not exceed 255 characters' })
  @ApiPropertyOptional()
  smtpPassword?: string;

  @IsEmail({}, { message: 'SMTP from email must be a valid email address' })
  @IsNotEmpty({ message: 'SMTP from email is required' })
  @MaxLength(255, { message: 'SMTP from email must not exceed 255 characters' })
  @ApiProperty()
  smtpFromEmail!: string;

  @IsString({ message: 'SMTP from name must be a string' })
  @IsNotEmpty({ message: 'SMTP from name is required' })
  @MaxLength(255, { message: 'SMTP from name must not exceed 255 characters' })
  @ApiProperty()
  smtpFromName!: string;

  @IsBoolean({ message: 'SMTP enabled must be a boolean value' })
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty()
  smtpEnabled!: boolean;
}
