import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LoginProvider } from '../entities/user.entity';

export class CreateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @ApiPropertyOptional()
  email?: string;

  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  @ApiProperty()
  fullName!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @ApiProperty()
  password!: string;

  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  @ApiProperty()
  phone!: string;

  @IsOptional()
  @IsString({ message: 'Date of birth must be a string' })
  @ApiPropertyOptional()
  dateOfBirth?: string;

  @IsOptional()
  @IsString({ message: 'Gender must be a string' })
  @IsIn(['male', 'female'], { message: 'Gender must be either male or female' })
  @ApiPropertyOptional({ enum: ['male', 'female'] })
  gender?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (value === 'true' || value === '1' || value === true) return true;
    if (value === 'false' || value === '0' || value === false) return false;
    return undefined;
  })
  @ApiPropertyOptional()
  isBanned?: boolean;

  @IsOptional()
  @IsString({ message: 'Profile image URL must be a string' })
  @ApiPropertyOptional()
  profileImageUrl?: string;

  @IsOptional()
  @IsString({ message: 'Login provider must be a string' })
  @IsIn(Object.values(LoginProvider))
  @ApiPropertyOptional({ enum: LoginProvider })
  loginProvider?: LoginProvider;
}
