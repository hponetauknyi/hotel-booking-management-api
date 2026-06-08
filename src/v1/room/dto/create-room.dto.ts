import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateRoomDto {
  @IsUUID('4', { message: 'Room type ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Room type ID is required' })
  @ApiProperty()
  roomTypeId!: string;

  @IsString({ message: 'Room number must be a string' })
  @IsNotEmpty({ message: 'Room number is required' })
  @ApiProperty({ example: '101' })
  roomNumber!: string;

  @IsInt({ message: 'Floor number must be an integer' })
  @Min(1, { message: 'Floor number must be at least 1' })
  @Max(200, { message: 'Floor number must not exceed 200' })
  @ApiProperty({ example: 1 })
  floorNumber!: number;
}
