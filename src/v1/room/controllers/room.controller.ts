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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequirePermissions } from 'src/v1/auth/decorators/permissions.decorator';
import { Public } from 'src/v1/auth/decorators/public.decorator';
import { PermissionModule } from 'src/v1/auth/entities/permission.entity';
import { PermissionsGuard } from 'src/v1/auth/guards/permissions.guard';
import { LogAction } from 'src/v1/log/constants/log-action.enum';
import { LogActivity } from 'src/v1/log/decorators/log-activity.decorator';
import { BulkCreateRoomDto } from '../dto/bulk-create-room.dto';
import { CreateRoomDto } from '../dto/create-room.dto';
import { FilterRoomDto } from '../dto/filter-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { RoomService } from '../services/room.service';

@Controller({ path: 'hotels/:hotelId/rooms', version: '1' })
@UseGuards(PermissionsGuard)
@ApiBearerAuth('jwt-auth')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all rooms for a specific hotel with optional filters',
  })
  async findAllByHotel(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
    @Query() queryRoomDto: FilterRoomDto,
  ) {
    return this.roomService.findAllByHotel(hotelId, queryRoomDto);
  }

  @Post()
  @LogActivity({
    action: LogAction.CREATE,
    description: 'Admin created a room',
    resourceType: 'Room',
  })
  @ApiOperation({ summary: 'Create a new room for a hotel' })
  @RequirePermissions({ module: PermissionModule.HOTELS, permission: 'create' })
  async create(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    return this.roomService.create(hotelId, createRoomDto);
  }

  @Post('bulk')
  @LogActivity({
    action: LogAction.CREATE,
    description: 'Admin bulk-created rooms',
    resourceType: 'Room',
  })
  @RequirePermissions({ module: PermissionModule.HOTELS, permission: 'create' })
  @ApiOperation({ summary: 'Bulk create rooms for a hotel' })
  async bulkCreate(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
    @Body() bulkCreateRoomDto: BulkCreateRoomDto,
  ) {
    return this.roomService.bulkCreate(hotelId, bulkCreateRoomDto);
  }

  @Patch(':id')
  @LogActivity({
    action: LogAction.UPDATE,
    description: 'Admin updated a room',
    resourceType: 'Room',
  })
  @RequirePermissions({ module: PermissionModule.HOTELS, permission: 'update' })
  @ApiOperation({ summary: 'Update an existing room' })
  async update(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.update(hotelId, id, updateRoomDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @LogActivity({
    action: LogAction.DELETE,
    description: 'Admin deleted a room',
    resourceType: 'Room',
  })
  @ApiOperation({ summary: 'Delete a room' })
  @RequirePermissions({ module: PermissionModule.HOTELS, permission: 'delete' })
  async remove(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.roomService.remove(hotelId, id);
  }
}
