import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/v1/auth/guards/permissions.guard';
import { RoomTypeService } from '../services/room-type.service';

@Controller({ path: 'room-characteristics', version: '1' })
@UseGuards(PermissionsGuard)
@ApiBearerAuth('jwt-auth')
export class RoomCharacteristicController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Get()
  async findAll() {
    return this.roomTypeService.findAllCharacteristics();
  }
}
