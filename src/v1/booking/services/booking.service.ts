import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedUser } from 'src/v1/auth/interfaces/user.interface';
import { RateOption } from 'src/v1/rate-option/entities/rate-option.entity';
import { Room, RoomStatus } from 'src/v1/room/entities/room.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { FilterBookingDto } from '../dto/filter-booking.dto';
import { PatchBookingStatusDto } from '../dto/patch-booking-status.dto';
import { BookingRoom } from '../entities/booking-room.entity';
import { Booking, BookingStatus } from '../entities/booking.entity';

const CUSTOMER_ALLOWED_TRANSITIONS: Partial<
  Record<BookingStatus, BookingStatus[]>
> = {
  [BookingStatus.PENDING]: [BookingStatus.CANCELLED],
  [BookingStatus.CONFIRMED]: [BookingStatus.CANCELLED],
};

const ADMIN_ONLY_TRANSITIONS: Partial<Record<BookingStatus, BookingStatus[]>> =
  {
    [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    [BookingStatus.CONFIRMED]: [
      BookingStatus.CHECKED_IN,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.CHECKED_IN]: [BookingStatus.CHECKED_OUT],
  };

const VALID_SORT_FIELDS: (keyof Booking)[] = [
  'bookedAt',
  'createdAt',
  'status',
  'totalPrice',
];

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(BookingRoom)
    private bookingRoomRepository: Repository<BookingRoom>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RateOption)
    private rateOptionRepository: Repository<RateOption>,
    private dataSource: DataSource,
  ) {}

  async create(
    dto: CreateBookingDto,
    currentUser: AuthenticatedUser,
  ): Promise<Booking> {
    // 1. Validate all dates and collect room/rate data
    const roomItems = await this.validateAndPrepareRooms(dto);

    // 2. Check double-booking for every requested room in a single query
    await this.assertNoDoubleBooking(
      dto.rooms.map((r) => ({
        roomId: r.roomId,
        checkInDate: r.checkInDate,
        checkOutDate: r.checkOutDate,
      })),
    );

    // 3. Calculate totals
    let totalPrice = 0;
    let totalGuest = 0;

    const bookingRoomData = roomItems.map((item) => {
      const nights = this.calcNights(item.checkInDate, item.checkOutDate);
      const pricePerNight = parseFloat(item.rateOption.pricePerNight);
      const roomTotal = pricePerNight * nights;

      totalPrice += roomTotal;
      totalGuest += item.guestCount;

      return {
        roomId: item.roomId,
        rateOptionId: item.rateOptionId,
        checkInDate: item.checkInDate,
        checkOutDate: item.checkOutDate,
        guestCount: item.guestCount,
        roomPricePerNight: String(pricePerNight),
        roomTotalPrice: String(roomTotal),
      };
    });

    // 4. Persist inside a transaction
    const booking = await this.dataSource.transaction(async (manager) => {
      const bookingEntity = manager.create(Booking, {
        userId: currentUser.id,
        bookingReference: this.generateReference(),
        status: BookingStatus.PENDING,
        totalPrice: String(totalPrice),
        totalGuest,
        bookedAt: new Date(),
      });

      const savedBooking = await manager.save(Booking, bookingEntity);

      const rooms = manager.create(
        BookingRoom,
        bookingRoomData.map((r) => ({ ...r, bookingId: savedBooking.id })),
      );

      await manager.save(BookingRoom, rooms);

      // 5. Mark rooms as OCCUPIED
      await manager
        .createQueryBuilder()
        .update(Room)
        .set({ status: RoomStatus.OCCUPIED })
        .where('id IN (:...roomIds)', {
          roomIds: bookingRoomData.map((r) => r.roomId),
        })
        .execute();

      return savedBooking;
    });

    this.logger.log(
      `Booking '${booking.bookingReference}' created by user '${currentUser.id}'`,
    );

    return this.findOneOrFail(booking.id, currentUser);
  }

  async findAll(filter: FilterBookingDto, currentUser: AuthenticatedUser) {
    const { page, limit, getAll } = filter;
    const skip = (page - 1) * limit;
    const isAdmin = currentUser.subjectType === 'ADMIN';

    const sortField = VALID_SORT_FIELDS.includes(filter.sortBy as keyof Booking)
      ? (filter.sortBy as keyof Booking)
      : 'bookedAt';
    const sortOrder = filter.sortOrder ?? 'DESC';

    const qb = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.bookingRooms', 'bookingRoom')
      .leftJoinAndSelect('bookingRoom.room', 'room')
      .leftJoinAndSelect('bookingRoom.rateOption', 'rateOption')
      .orderBy(`booking.${sortField}`, sortOrder);

    if (!isAdmin) {
      qb.andWhere('booking.userId = :userId', { userId: currentUser.id });
    }

    if (filter.status) {
      qb.andWhere('booking.status = :status', { status: filter.status });
    }

    if (!getAll) {
      qb.skip(skip).take(limit);
    }

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  async findOne(id: string, currentUser: AuthenticatedUser): Promise<Booking> {
    return this.findOneOrFail(id, currentUser);
  }

  async patchStatus(
    id: string,
    dto: PatchBookingStatusDto,
    currentUser: AuthenticatedUser,
  ): Promise<Booking> {
    const isAdmin = currentUser.subjectType === 'ADMIN';

    const booking = await this.bookingRepository.findOne({
      where: isAdmin ? { id } : { id, userId: currentUser.id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID '${id}' not found`);
    }

    this.assertValidTransition(booking.status, dto.status, isAdmin);

    booking.status = dto.status;
    const savedBooking = await this.bookingRepository.save(booking);

    if (
      dto.status === BookingStatus.CHECKED_OUT ||
      dto.status === BookingStatus.CANCELLED
    ) {
      // Mark rooms as AVAILABLE again
      const bookingRooms = await this.bookingRoomRepository.find({
        where: { bookingId: booking.id },
      });

      await this.dataSource
        .createQueryBuilder()
        .update(Room)
        .set({ status: RoomStatus.AVAILABLE })
        .where('id IN (:...roomIds)', {
          roomIds: bookingRooms.map((br) => br.roomId),
        })
        .execute();
    }

    this.logger.log(
      `Booking '${booking.bookingReference}' status changed to '${dto.status}' by '${currentUser.id}'`,
    );

    return this.findOneOrFail(savedBooking.id, currentUser);
  }

  private async findOneOrFail(
    id: string,
    currentUser: AuthenticatedUser,
  ): Promise<Booking> {
    const isAdmin = currentUser.subjectType === 'ADMIN';

    const booking = await this.bookingRepository.findOne({
      where: isAdmin ? { id } : { id, userId: currentUser.id },
      relations: [
        'bookingRooms',
        'bookingRooms.room',
        'bookingRooms.room.roomType',
        'bookingRooms.rateOption',
        'bookingRooms.rateOption.rateOptionBenefits',
        'bookingRooms.rateOption.rateOptionBenefits.benefit',
        'user',
      ],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID '${id}' not found`);
    }

    return booking;
  }

  private async validateAndPrepareRooms(dto: CreateBookingDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Catch duplicate rooms within the request itself
    const requestedRoomIds = dto.rooms.map((r) => r.roomId);
    const duplicateRoomIds = requestedRoomIds.filter(
      (id, idx) => requestedRoomIds.indexOf(id) !== idx,
    );
    if (duplicateRoomIds.length) {
      throw new BadRequestException(
        `Duplicate room(s) in request: ${[...new Set(duplicateRoomIds)].join(', ')}`,
      );
    }

    return Promise.all(
      dto.rooms.map(async (item) => {
        const checkIn = new Date(item.checkInDate);
        const checkOut = new Date(item.checkOutDate);

        if (checkIn < today) {
          throw new BadRequestException(
            `Check-in date '${item.checkInDate}' cannot be in the past`,
          );
        }

        if (checkOut <= checkIn) {
          throw new BadRequestException(
            `Check-out date '${item.checkOutDate}' must be after check-in date '${item.checkInDate}'`,
          );
        }

        const room = await this.roomRepository.findOne({
          where: { id: item.roomId },
          relations: ['roomType'],
        });

        if (!room) {
          throw new NotFoundException(
            `Room with ID '${item.roomId}' not found`,
          );
        }

        const isBookedForPeriod = await this.bookingRoomRepository
          .createQueryBuilder('br')
          .innerJoin('br.booking', 'booking')
          .where('br.roomId = :roomId', { roomId: item.roomId })
          .andWhere('booking.status != :cancelled', {
            cancelled: BookingStatus.CANCELLED,
          })
          .andWhere('br.checkInDate < :checkOut', {
            checkOut: item.checkOutDate,
          })
          .andWhere('br.checkOutDate > :checkIn', {
            checkIn: item.checkInDate,
          })
          .getOne();

        if (isBookedForPeriod) {
          throw new BadRequestException(
            `Room '${room.roomNumber}' is not available (status: ${room.status})`,
          );
        }

        const rateOption = await this.rateOptionRepository.findOne({
          where: { id: item.rateOptionId, roomTypeId: room.roomTypeId },
        });

        if (!rateOption) {
          throw new NotFoundException(
            `Rate option '${item.rateOptionId}' not found for room '${item.roomId}'`,
          );
        }

        if (item.guestCount > room.roomType.maxOccupancy) {
          throw new BadRequestException(
            `Guest count ${item.guestCount} exceeds max occupancy ${room.roomType.maxOccupancy} for room '${room.roomNumber}'`,
          );
        }

        return {
          roomId: item.roomId,
          rateOptionId: item.rateOptionId,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
          guestCount: item.guestCount,
          rateOption,
        };
      }),
    );
  }

  private async assertNoDoubleBooking(
    items: { roomId: string; checkInDate: string; checkOutDate: string }[],
  ): Promise<void> {
    for (const item of items) {
      const conflict = await this.bookingRoomRepository
        .createQueryBuilder('br')
        .innerJoin('br.booking', 'booking')
        .where('br.roomId = :roomId', { roomId: item.roomId })
        .andWhere('booking.status != :cancelled', {
          cancelled: BookingStatus.CANCELLED,
        })
        .andWhere('br.checkInDate < :checkOut', {
          checkOut: item.checkOutDate,
        })
        .andWhere('br.checkOutDate > :checkIn', {
          checkIn: item.checkInDate,
        })
        .getOne();

      if (conflict) {
        throw new ConflictException(
          `Room '${item.roomId}' is already booked from ${conflict.checkInDate} to ${conflict.checkOutDate}`,
        );
      }
    }
  }

  private assertValidTransition(
    current: BookingStatus,
    next: BookingStatus,
    isAdmin: boolean,
  ): void {
    if (current === next) {
      throw new BadRequestException(
        `Booking is already in '${current}' status`,
      );
    }

    const adminAllowed = ADMIN_ONLY_TRANSITIONS[current] ?? [];
    const customerAllowed = CUSTOMER_ALLOWED_TRANSITIONS[current] ?? [];

    const allAllowed = isAdmin ? adminAllowed : customerAllowed;

    if (!allAllowed.includes(next)) {
      throw new ForbiddenException(
        `Cannot transition booking from '${current}' to '${next}'`,
      );
    }
  }

  private calcNights(checkInDate: string, checkOutDate: string): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
        msPerDay,
    );
  }

  private generateReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const rand = Array.from({ length: 8 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join('');
    return `BK-${rand}`;
  }
}
