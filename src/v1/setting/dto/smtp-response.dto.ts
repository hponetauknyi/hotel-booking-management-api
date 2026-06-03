import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SMTPResponseDto {
  @Expose()
  @ApiProperty()
  smtpHost!: string;

  @Expose()
  @ApiProperty()
  smtpPort!: number;

  @Expose()
  @ApiProperty()
  smtpSecure!: boolean;

  @Expose()
  @ApiProperty()
  smtpUsername!: string;

  @Expose()
  @ApiProperty()
  smtpPassword!: string;

  @Expose()
  @ApiProperty()
  smtpFromEmail!: string;

  @Expose()
  @ApiProperty()
  smtpFromName!: string;

  @Expose()
  @ApiProperty()
  smtpEnabled!: boolean;

  @Expose()
  @ApiProperty()
  createdAt!: Date;

  @Expose()
  @ApiProperty()
  updatedAt!: Date;
}
