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
import { CurrentUser } from 'src/v1/auth/decorators/current-user.decorator';
import { Public } from 'src/v1/auth/decorators/public.decorator';
import { AuthenticatedUser } from 'src/v1/auth/interfaces/user.interface';
import { LogAction } from 'src/v1/log/constants/log-action.enum';
import { LogActivity } from 'src/v1/log/decorators/log-activity.decorator';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { FilterHotelDto } from '../dto/filter-hotel.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { HotelService } from '../services/hotel.service';
import { PermissionsGuard } from 'src/v1/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/v1/auth/decorators/permissions.decorator';
import { PermissionModule } from 'src/v1/auth/entities/permission.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({ path: 'hotels', version: '1' })
@UseGuards(PermissionsGuard)
@ApiBearerAuth('jwt-auth')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  @Public()
  async findAll(
    @Query() filters: FilterHotelDto,
    @CurrentUser() currentUser?: AuthenticatedUser,
  ) {
    return this.hotelService.findAll(filters, currentUser);
  }

  @Get(':id')
  @Public()
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() currentUser?: AuthenticatedUser,
  ) {
    return this.hotelService.findOne(id, currentUser);
  }

  @Post()
  @LogActivity({
    action: LogAction.CREATE,
    description: 'Admin created a hotel',
    resourceType: 'Hotel',
  })
  @RequirePermissions({
    module: PermissionModule.HOTELS,
    permission: 'create',
  })
  async create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() createHotelDto: CreateHotelDto,
  ) {
    return this.hotelService.create(createHotelDto, currentUser);
  }

  @Patch(':id')
  @LogActivity({
    action: LogAction.UPDATE,
    description: 'Admin updated a hotel',
    resourceType: 'Hotel',
  })
  @RequirePermissions({ module: PermissionModule.HOTELS, permission: 'update' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    return this.hotelService.update(id, updateHotelDto, currentUser);
  }

  @Delete(':id')
  @HttpCode(200)
  @LogActivity({
    action: LogAction.DELETE,
    description: 'Admin deleted a hotel',
    resourceType: 'Hotel',
  })
  @RequirePermissions({ module: PermissionModule.HOTELS, permission: 'delete' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    await this.hotelService.remove(id, currentUser);
  }
}
