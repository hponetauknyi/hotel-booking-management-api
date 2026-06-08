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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/v1/auth/decorators/public.decorator';
import { RequirePermissions } from 'src/v1/auth/decorators/permissions.decorator';
import { PermissionModule } from 'src/v1/auth/entities/permission.entity';
import { PermissionsGuard } from 'src/v1/auth/guards/permissions.guard';
import { LogAction } from 'src/v1/log/constants/log-action.enum';
import { LogActivity } from 'src/v1/log/decorators/log-activity.decorator';
import { RateOptionService } from '../services/rate-option.service';
import { CreateRateOptionDto } from '../dto/create-rate-option.dto';
import { UpdateRateOptionDto } from '../dto/update-rate-option.dto';
import { ManageRateOptionBenefitsDto } from '../dto/manage-rate-option-benefits.dto';

@Controller({
  path: 'hotels/:hotelId/room-types/:roomTypeId/rate-options',
  version: '1',
})
@UseGuards(PermissionsGuard)
@ApiBearerAuth('jwt-auth')
export class RateOptionController {
  constructor(private readonly rateOptionService: RateOptionService) {}

  @Post()
  @LogActivity({
    action: LogAction.CREATE,
    description: 'Admin created a rate option',
    resourceType: 'RateOption',
  })
  @RequirePermissions({
    module: PermissionModule.ROOM_TYPES,
    permission: 'create',
  })
  @ApiOperation({ summary: 'Create a new rate option for a room type' })
  async create(
    @Param('roomTypeId', new ParseUUIDPipe({ version: '4' }))
    roomTypeId: string,
    @Body() createRateOptionDto: CreateRateOptionDto,
  ) {
    return this.rateOptionService.create(roomTypeId, createRateOptionDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all rate options for a room type' })
  async findAllByRoomType(
    @Param('roomTypeId', new ParseUUIDPipe({ version: '4' }))
    roomTypeId: string,
  ) {
    return this.rateOptionService.findAllByRoomType(roomTypeId);
  }

  @Patch(':id')
  @LogActivity({
    action: LogAction.UPDATE,
    description: 'Admin updated a rate option',
    resourceType: 'RateOption',
  })
  @RequirePermissions({
    module: PermissionModule.ROOM_TYPES,
    permission: 'update',
  })
  @ApiOperation({ summary: 'Update a rate option for a room type' })
  async update(
    @Param('roomTypeId', new ParseUUIDPipe({ version: '4' }))
    roomTypeId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateRateOptionDto: UpdateRateOptionDto,
  ) {
    return this.rateOptionService.update(roomTypeId, id, updateRateOptionDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @LogActivity({
    action: LogAction.DELETE,
    description: 'Admin deleted a rate option',
    resourceType: 'RateOption',
  })
  @RequirePermissions({
    module: PermissionModule.ROOM_TYPES,
    permission: 'delete',
  })
  @ApiOperation({ summary: 'Delete a rate option from a room type' })
  async remove(
    @Param('roomTypeId', new ParseUUIDPipe({ version: '4' }))
    roomTypeId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.rateOptionService.remove(roomTypeId, id);
  }

  @Post(':id/benefits')
  @HttpCode(200)
  @LogActivity({
    action: LogAction.UPDATE,
    description: 'Admin added benefits to a rate option',
    resourceType: 'RateOption',
  })
  @RequirePermissions({
    module: PermissionModule.ROOM_TYPES,
    permission: 'update',
  })
  @ApiOperation({ summary: 'Add benefits to a rate option' })
  async addBenefits(
    @Param('roomTypeId', new ParseUUIDPipe({ version: '4' }))
    roomTypeId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: ManageRateOptionBenefitsDto,
  ) {
    return this.rateOptionService.addBenefits(roomTypeId, id, dto);
  }

  @Delete(':id/benefits')
  @HttpCode(200)
  @LogActivity({
    action: LogAction.UPDATE,
    description: 'Admin removed benefits from a rate option',
    resourceType: 'RateOption',
  })
  @RequirePermissions({
    module: PermissionModule.ROOM_TYPES,
    permission: 'update',
  })
  @ApiOperation({ summary: 'Remove benefits from a rate option' })
  async removeBenefits(
    @Param('roomTypeId', new ParseUUIDPipe({ version: '4' }))
    roomTypeId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: ManageRateOptionBenefitsDto,
  ) {
    return this.rateOptionService.removeBenefits(roomTypeId, id, dto);
  }
}
