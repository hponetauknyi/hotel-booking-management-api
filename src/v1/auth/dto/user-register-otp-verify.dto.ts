import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UserRegisterOTPVerifyDto {
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^09\d{7,9}$/, {
    message: 'Phone number must start with 09 and be followed by 7 to 9 digits',
  })
  @ApiProperty()
  phone!: string;

  @IsString({ message: 'OTP must be a string' })
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @ApiProperty()
  otp!: string;

  @IsString({ message: 'FCM token must be a string' })
  @IsNotEmpty({ message: 'FCM token is required' })
  @ApiProperty()
  fcmToken!: string;

  @IsString({ message: 'Request ID must be a string' })
  @IsNotEmpty({ message: 'Request ID is required' })
  @ApiProperty()
  requestId!: string;
}
