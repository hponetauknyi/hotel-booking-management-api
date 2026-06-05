import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateRoomDto } from './create-room.dto';

export class BulkCreateRoomDto {
  @IsArray({ message: 'Rooms must be an array' })
  @ArrayNotEmpty({ message: 'Rooms array must not be empty' })
  @ArrayMinSize(1, { message: 'At least one room is required' })
  @ArrayMaxSize(100, {
    message: 'No more than 100 rooms can be created at once',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateRoomDto)
  @ApiProperty({ type: [CreateRoomDto] })
  rooms!: CreateRoomDto[];
}
