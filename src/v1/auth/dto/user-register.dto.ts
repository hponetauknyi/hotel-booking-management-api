import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserRegisterDto {
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  @ApiProperty({ example: '+66812345678' })
  phone!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @ApiProperty()
  password!: string;

  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  @ApiProperty()
  fullName!: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @IsString({ message: 'Date of birth must be a string' })
  @ApiPropertyOptional({ example: '1990-01-01' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString({ message: 'Gender must be a string' })
  @IsIn(['male', 'female'], { message: 'Gender must be either male or female' })
  @ApiPropertyOptional({ enum: ['male', 'female'] })
  gender?: string;

  @IsOptional()
  @IsString({ message: 'Preferred language must be a string' })
  @ApiPropertyOptional({ example: 'en' })
  preferLanguage?: string;

  @IsOptional()
  @IsString({ message: 'FCM token must be a string' })
  @ApiPropertyOptional()
  fcmToken?: string;
}
