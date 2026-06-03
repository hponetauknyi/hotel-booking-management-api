import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserGoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  fcmToken?: string;
}
