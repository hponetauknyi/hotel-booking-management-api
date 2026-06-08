import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/v1/auth/decorators/current-user.decorator';
import { RequirePermissions } from 'src/v1/auth/decorators/permissions.decorator';
import { AuthenticatedUser } from 'src/v1/auth/interfaces/user.interface';
import { PermissionModule } from 'src/v1/auth/entities/permission.entity';
import { PermissionsGuard } from 'src/v1/auth/guards/permissions.guard';
import { LogAction } from 'src/v1/log/constants/log-action.enum';
import { LogActivity } from 'src/v1/log/decorators/log-activity.decorator';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { FilterBookingDto } from '../dto/filter-booking.dto';
import { PatchBookingStatusDto } from '../dto/patch-booking-status.dto';
import { BookingService } from '../services/booking.service';

@Controller({ path: 'bookings', version: '1' })
@UseGuards(PermissionsGuard)
@ApiBearerAuth('jwt-auth')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @LogActivity({
    action: LogAction.CREATE,
    description: 'User created a booking',
    resourceType: 'Booking',
  })
  @RequirePermissions({
    module: PermissionModule.BOOKINGS,
    permission: 'create',
  })
  @ApiOperation({ summary: 'Create a new booking' })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.bookingService.create(createBookingDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @RequirePermissions({ module: PermissionModule.BOOKINGS, permission: 'read' })
  async findAll(
    @Query() filter: FilterBookingDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.bookingService.findAll(filter, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific booking' })
  @RequirePermissions({ module: PermissionModule.BOOKINGS, permission: 'read' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.bookingService.findOne(id, currentUser);
  }

  @Patch(':id/status')
  @LogActivity({
    action: LogAction.UPDATE,
    description: 'Booking status updated',
    resourceType: 'Booking',
  })
  @RequirePermissions({
    module: PermissionModule.BOOKINGS,
    permission: 'update',
  })
  @ApiOperation({ summary: 'Update the status of a booking' })
  async patchStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: PatchBookingStatusDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.bookingService.patchStatus(id, dto, currentUser);
  }
}
