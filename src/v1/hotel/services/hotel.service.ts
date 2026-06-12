import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { AuthenticatedUser } from 'src/v1/auth/interfaces/user.interface';
import {
  attachAuditLogMetadata,
  diffAuditValues,
} from 'src/v1/log/utils/audit-log-metadata.util';
import { Repository } from 'typeorm';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { FilterHotelDto } from '../dto/filter-hotel.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { Hotel } from '../entities/hotel.entity';

const VALID_SORT_FIELDS: (keyof Hotel)[] = [
  'createdAt',
  'name',
  'city',
  'country',
  'isActive',
];

// Generate a stable cache key for hotel list
const hotelListKey = (filter: FilterHotelDto, isAdmin: boolean): string => {
  const stable = JSON.stringify(filter, Object.keys(filter).sort());
  return `hotels:list:${isAdmin ? 'admin' : 'guest'}:${stable}`;
};

const hotelDetailKey = (id: string, isAdmin: boolean): string =>
  `hotels:detail:${isAdmin ? 'admin' : 'guest'}:${id}`;

const hotelDetailKeys = (id: string): string[] => [
  hotelDetailKey(id, true),
  hotelDetailKey(id, false),
];

@Injectable()
export class HotelService {
  private readonly logger = new Logger(HotelService.name);

  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createHotelDto: CreateHotelDto,
    currentUser: AuthenticatedUser,
  ): Promise<Hotel> {
    this.assertAdmin(currentUser);

    const hotel = this.hotelRepository.create({
      ...createHotelDto,
      createdBy: currentUser.id,
    });

    const savedHotel = await this.hotelRepository.save(hotel);
    this.logger.log(`Hotel created with ID: ${savedHotel.id}`);

    await this.invalidateHotelLists();

    return savedHotel;
  }

  async findAll(filter: FilterHotelDto, currentUser?: AuthenticatedUser) {
    const { getAll, limit, page } = filter;
    const skip = (page - 1) * limit;

    const isAdmin = currentUser?.subjectType === 'ADMIN';
    const cacheKey = hotelListKey(filter, isAdmin);

    const cached = await this.cacheManager.get<{
      items: Hotel[];
      total: number;
    }>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit: ${cacheKey}`);
      return cached;
    }

    const qb = this.hotelRepository.createQueryBuilder('hotel').distinct(true);

    const orderField = VALID_SORT_FIELDS.includes(filter.sortBy as keyof Hotel)
      ? (filter.sortBy as keyof Hotel)
      : 'createdAt';
    const sortOrder = filter.sortOrder ?? 'DESC';

    qb.orderBy(`hotel.${orderField}`, sortOrder);

    if (!getAll) {
      qb.skip(skip).take(limit);
    }

    if (filter.search) {
      qb.andWhere(
        '(hotel.name ILIKE :term OR hotel.city ILIKE :term OR hotel.country ILIKE :term OR hotel.address ILIKE :term)',
        { term: `%${filter.search}%` },
      );
    }

    if (!isAdmin) {
      qb.andWhere('hotel.isActive = :isActive', { isActive: true });
    } else if (filter.isActive !== undefined) {
      qb.andWhere('hotel.isActive = :isActive', {
        isActive: filter.isActive,
      });
    }

    const needsRoomTypeJoin =
      (filter.roomTypeIds?.length ?? 0) > 0 ||
      (filter.roomCharacteristicIds?.length ?? 0) > 0 ||
      (filter.rateOptionIds?.length ?? 0) > 0 ||
      (filter.rateOptionBenefitIds?.length ?? 0) > 0 ||
      filter.minPrice !== undefined ||
      filter.maxPrice !== undefined;

    if (needsRoomTypeJoin) {
      qb.leftJoin('hotel.roomTypes', 'roomType');
    }

    if (filter.roomTypeIds?.length) {
      qb.andWhere('roomType.id IN (:...roomTypeIds)', {
        roomTypeIds: filter.roomTypeIds,
      });
    }

    if (filter.roomCharacteristicIds?.length) {
      qb.leftJoin('roomType.roomTypeCharacteristics', 'roomTypeCharacteristic')
        .leftJoin(
          'roomTypeCharacteristic.roomCharacteristic',
          'roomCharacteristic',
        )
        .andWhere('roomCharacteristic.id IN (:...roomCharacteristicIds)', {
          roomCharacteristicIds: filter.roomCharacteristicIds,
        });
    }

    const needsRateOptionJoin =
      (filter.rateOptionIds?.length ?? 0) > 0 ||
      (filter.rateOptionBenefitIds?.length ?? 0) > 0 ||
      filter.minPrice !== undefined ||
      filter.maxPrice !== undefined;

    if (needsRateOptionJoin) {
      qb.leftJoin('roomType.rateOptions', 'rateOption');
    }

    if (filter.rateOptionIds?.length) {
      qb.andWhere('rateOption.id IN (:...rateOptionIds)', {
        rateOptionIds: filter.rateOptionIds,
      });
    }

    if (filter.rateOptionBenefitIds?.length) {
      qb.leftJoin(
        'rateOption.rateOptionBenefits',
        'rateOptionBenefit',
      ).andWhere('rateOptionBenefit.id IN (:...rateOptionBenefitIds)', {
        rateOptionBenefitIds: filter.rateOptionBenefitIds,
      });
    }

    if (filter.minPrice !== undefined) {
      qb.andWhere('rateOption.pricePerNight >= :minPrice', {
        minPrice: filter.minPrice,
      });
    }

    if (filter.maxPrice !== undefined) {
      qb.andWhere('rateOption.pricePerNight <= :maxPrice', {
        maxPrice: filter.maxPrice,
      });
    }

    const [items, total] = await qb.getManyAndCount();
    const result = { items, total };

    const cacheTTL = this.configService.get<number>('CACHE_TTL') ?? 600_000;
    await this.cacheManager.set(cacheKey, result, cacheTTL);
    await this.registerListKey(cacheKey);
    return result;
  }

  async findOne(id: string, currentUser?: AuthenticatedUser): Promise<Hotel> {
    const isAdmin = currentUser?.subjectType === 'ADMIN';
    const cacheKey = hotelDetailKey(id, isAdmin);

    const cached = await this.cacheManager.get<Hotel>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit: ${cacheKey}`);
      return cached;
    }

    const hotel = await this.hotelRepository.findOne({
      where: isAdmin ? { id } : { id, isActive: true },
      relations: [
        'roomTypes',
        'roomTypes.roomTypeCharacteristics',
        'roomTypes.roomTypeCharacteristics.roomCharacteristic',
        'roomTypes.rateOptions',
        'roomTypes.rateOptions.rateOptionBenefits',
        'roomTypes.rateOptions.rateOptionBenefits.benefit',
      ],
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel with ID '${id}' not found`);
    }

    const cacheTTL = this.configService.get<number>('CACHE_TTL') ?? 600_000;
    await this.cacheManager.set(cacheKey, hotel, cacheTTL);

    return hotel;
  }

  async update(
    id: string,
    updateHotelDto: UpdateHotelDto,
    currentUser: AuthenticatedUser,
  ): Promise<Hotel> {
    this.assertAdmin(currentUser);

    const existingHotel = await this.hotelRepository.findOne({ where: { id } });

    if (!existingHotel) {
      throw new NotFoundException(`Hotel with ID '${id}' not found`);
    }

    const updatedHotel = await this.hotelRepository.preload({
      id,
      ...updateHotelDto,
    });

    if (!updatedHotel) {
      throw new NotFoundException(`Hotel with ID '${id}' not found`);
    }

    const savedHotel = await this.hotelRepository.save(updatedHotel);

    attachAuditLogMetadata(
      savedHotel,
      diffAuditValues(existingHotel, savedHotel, Object.keys(updateHotelDto)),
    );

    this.logger.log(`Hotel updated with ID: ${savedHotel.id}`);

    await Promise.all([
      ...hotelDetailKeys(id).map((k) => this.cacheManager.del(k)),
      this.invalidateHotelLists(),
    ]);

    return savedHotel;
  }

  async remove(id: string, currentUser: AuthenticatedUser): Promise<void> {
    this.assertAdmin(currentUser);

    const existingHotel = await this.hotelRepository.findOne({ where: { id } });

    if (!existingHotel) {
      throw new NotFoundException(`Hotel with ID '${id}' not found`);
    }

    await this.hotelRepository.remove(existingHotel);
    this.logger.log(`Hotel with ID '${id}' has been successfully deleted`);

    await Promise.all([
      ...hotelDetailKeys(id).map((k) => this.cacheManager.del(k)),
      this.invalidateHotelLists(),
    ]);
  }

  private readonly LIST_REGISTRY_KEY = 'hotels:list:__registry__';

  private async registerListKey(key: string): Promise<void> {
    const existing =
      (await this.cacheManager.get<string[]>(this.LIST_REGISTRY_KEY)) ?? [];
    if (!existing.includes(key)) {
      await this.cacheManager.set(
        this.LIST_REGISTRY_KEY,
        [...existing, key],
        this.configService.get<number>('CACHE_TTL') ?? 600_000,
      );
    }
  }

  private async invalidateHotelLists(): Promise<void> {
    const keys =
      (await this.cacheManager.get<string[]>(this.LIST_REGISTRY_KEY)) ?? [];
    await Promise.all(keys.map((k) => this.cacheManager.del(k)));
    await this.cacheManager.del(this.LIST_REGISTRY_KEY);
    this.logger.debug(`Invalidated ${keys.length} hotel list cache key(s)`);
  }

  private assertAdmin(currentUser: AuthenticatedUser): void {
    if (currentUser.subjectType !== 'ADMIN') {
      throw new ForbiddenException('Only admins can manage hotels');
    }
  }
}
