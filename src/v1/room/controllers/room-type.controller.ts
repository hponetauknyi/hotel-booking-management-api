import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/v1/auth/decorators/public.decorator';
import { RequirePermissions } from 'src/v1/auth/decorators/permissions.decorator';
import { PermissionModule } from 'src/v1/auth/entities/permission.entity';
import { PermissionsGuard } from 'src/v1/auth/guards/permissions.guard';
import { LogAction } from 'src/v1/log/constants/log-action.enum';
import { LogActivity } from 'src/v1/log/decorators/log-activity.decorator';
import { RoomTypeService } from '../services/room-type.service';
import { CreateRoomTypeDto } from '../dto/create-room-type.dto';
import { UpdateRoomTypeDto } from '../dto/update-room-type.dto';

@Controller({ path: 'hotels/:hotelId/room-types', version: '1' })
@UseGuards(PermissionsGuard)
@ApiBearerAuth('jwt-auth')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Post()
  @LogActivity({
    action: LogAction.CREATE,
    description: 'Admin created a room type',
    resourceType: 'RoomType',
  })
  @RequirePermissions({ module: PermissionModule.HOTELS, permission: 'create' })
  async create(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
    @Body() createRoomTypeDto: CreateRoomTypeDto,
  ) {
    return this.roomTypeService.create(hotelId, createRoomTypeDto);
  }

  @Get()
  @Public()
  async findAllByHotel(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
  ) {
    return this.roomTypeService.findAllByHotel(hotelId);
  }

  @Patch(':id')
  @LogActivity({
    action: LogAction.UPDATE,
    description: 'Admin updated a room type',
    resourceType: 'RoomType',
  })
  @RequirePermissions({ module: PermissionModule.HOTELS, permission: 'update' })
  async update(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
  ) {
    return this.roomTypeService.update(hotelId, id, updateRoomTypeDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @LogActivity({
    action: LogAction.DELETE,
    description: 'Admin deleted a room type',
    resourceType: 'RoomType',
  })
  @RequirePermissions({ module: PermissionModule.HOTELS, permission: 'delete' })
  async remove(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.roomTypeService.remove(hotelId, id);
  }
}
