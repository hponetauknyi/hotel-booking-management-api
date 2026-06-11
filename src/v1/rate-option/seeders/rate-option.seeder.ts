import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from 'src/common/enums/currency.enum';
import { Hotel } from 'src/v1/hotel/entities/hotel.entity';
import { RoomType } from 'src/v1/room/entities/room-type.entity';
import { Repository } from 'typeorm';
import { CancellationPolicy, RateOption } from '../entities/rate-option.entity';

interface RateOptionSeed {
  hotelName: string;
  roomTypeName: string;
  name: string;
  description: string;
  pricePerNight: string;
  currency: Currency;
  isRefundable: boolean;
  cancellationPolicy: CancellationPolicy;
  deadlineHours: number | null;
}

@Injectable()
export class RateOptionSeeder {
  constructor(
    @InjectRepository(RateOption)
    private rateOptionRepository: Repository<RateOption>,
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async seed(): Promise<void> {
    const rateOptions: RateOptionSeed[] = [
      // ── Yangon Grand Palace Hotel — Standard Twin ──────────────────────────
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Standard Twin',
        name: 'Room Only',
        description:
          'No meals included. Free cancellation up to 48 hours before check-in.',
        pricePerNight: '75.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION_UNTIL_DEADLINE,
        deadlineHours: 48,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Standard Twin',
        name: 'Non-Refundable',
        description: 'Best price, no cancellation or modification allowed.',
        pricePerNight: '60.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Yangon Grand Palace Hotel — Deluxe King ────────────────────────────
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Deluxe King',
        name: 'Bed & Breakfast',
        description:
          'Daily breakfast for two included. Free cancellation up to 72 hours.',
        pricePerNight: '130.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION_UNTIL_DEADLINE,
        deadlineHours: 72,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Deluxe King',
        name: 'Non-Refundable',
        description: 'Best price, no cancellation or modification allowed.',
        pricePerNight: '105.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Yangon Grand Palace Hotel — Executive Suite ────────────────────────
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Executive Suite',
        name: 'Suite with Breakfast',
        description:
          'Full breakfast and evening cocktails included. Free cancellation up to 7 days.',
        pricePerNight: '280.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION_UNTIL_DEADLINE,
        deadlineHours: 168,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Executive Suite',
        name: 'Non-Refundable Suite',
        description: 'Best price suite. No cancellation or modification.',
        pricePerNight: '230.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Mandalay Royal View Hotel — Superior Twin ──────────────────────────
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Superior Twin',
        name: 'Room Only',
        description: 'No meals. Free cancellation any time.',
        pricePerNight: '65.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION,
        deadlineHours: null,
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Superior Twin',
        name: 'Non-Refundable',
        description: 'Lowest rate, strict no-cancellation policy.',
        pricePerNight: '50.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Mandalay Royal View Hotel — Deluxe Double ─────────────────────────
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Deluxe Double',
        name: 'Bed & Breakfast',
        description: 'Breakfast included. Free cancellation up to 48 hours.',
        pricePerNight: '110.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION_UNTIL_DEADLINE,
        deadlineHours: 48,
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Deluxe Double',
        name: 'Non-Refundable',
        description: 'Best available rate, no modification allowed.',
        pricePerNight: '88.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Mandalay Royal View Hotel — Family Room ────────────────────────────
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Family Room',
        name: 'Family Bed & Breakfast',
        description:
          'Breakfast for all guests. Free cancellation up to 72 hours.',
        pricePerNight: '170.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION_UNTIL_DEADLINE,
        deadlineHours: 72,
      },

      // ── Bagan Heritage Resort — Garden Cottage ─────────────────────────────
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Garden Cottage',
        name: 'Cottage Only',
        description: 'No meals. Free cancellation any time.',
        pricePerNight: '95.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION,
        deadlineHours: null,
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Garden Cottage',
        name: 'Non-Refundable',
        description: 'Best rate, no cancellation.',
        pricePerNight: '78.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Bagan Heritage Resort — Temple View Villa ──────────────────────────
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Temple View Villa',
        name: 'Half Board',
        description:
          'Breakfast and dinner included. Free cancellation up to 5 days.',
        pricePerNight: '210.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION_UNTIL_DEADLINE,
        deadlineHours: 120,
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Temple View Villa',
        name: 'Non-Refundable',
        description: 'Best rate villa. No cancellation.',
        pricePerNight: '175.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Bagan Heritage Resort — Pool Villa ────────────────────────────────
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Pool Villa',
        name: 'All Inclusive',
        description:
          'All meals, beverages, and resort activities included. Free cancellation up to 7 days.',
        pricePerNight: '420.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION_UNTIL_DEADLINE,
        deadlineHours: 168,
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Pool Villa',
        name: 'Non-Refundable',
        description: 'Best rate pool villa. No cancellation or modification.',
        pricePerNight: '350.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Inle Lake Garden Hotel — Garden View Room ──────────────────────────
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Garden View Room',
        name: 'Room Only',
        description: 'No meals. Free cancellation any time before check-in.',
        pricePerNight: '80.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION,
        deadlineHours: null,
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Garden View Room',
        name: 'Non-Refundable',
        description: 'Best rate. No cancellation.',
        pricePerNight: '65.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Inle Lake Garden Hotel — Lake View Room ────────────────────────────
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Lake View Room',
        name: 'Bed & Breakfast',
        description:
          'Breakfast for two included. Free cancellation up to 48 hours.',
        pricePerNight: '140.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION_UNTIL_DEADLINE,
        deadlineHours: 48,
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Lake View Room',
        name: 'Non-Refundable',
        description: 'Best available rate. No modification.',
        pricePerNight: '115.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Inle Lake Garden Hotel — Over-water Bungalow ──────────────────────
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Over-water Bungalow',
        name: 'Half Board',
        description: 'Breakfast and dinner. Free cancellation up to 7 days.',
        pricePerNight: '320.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION_UNTIL_DEADLINE,
        deadlineHours: 168,
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Over-water Bungalow',
        name: 'Non-Refundable',
        description: 'Best bungalow rate. No cancellation.',
        pricePerNight: '265.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Ngapali Sunset Beach Hotel — Beach Front Room ─────────────────────
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Beach Front Room',
        name: 'Room Only',
        description: 'No meals. Free cancellation any time.',
        pricePerNight: '160.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION,
        deadlineHours: null,
      },
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Beach Front Room',
        name: 'Non-Refundable',
        description: 'Best beach room rate. No cancellation.',
        pricePerNight: '130.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },

      // ── Ngapali Sunset Beach Hotel — Ocean Suite ───────────────────────────
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Ocean Suite',
        name: 'All Inclusive',
        description:
          'All meals and resort facilities. Free cancellation up to 7 days.',
        pricePerNight: '500.00',
        currency: Currency.USD,
        isRefundable: true,
        cancellationPolicy: CancellationPolicy.FREE_CANCELLATION_UNTIL_DEADLINE,
        deadlineHours: 168,
      },
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Ocean Suite',
        name: 'Non-Refundable',
        description: 'Best ocean suite rate. No cancellation.',
        pricePerNight: '420.00',
        currency: Currency.USD,
        isRefundable: false,
        cancellationPolicy: CancellationPolicy.NON_REFUNDABLE,
        deadlineHours: null,
      },
    ];

    for (const seed of rateOptions) {
      const hotel = await this.hotelRepository.findOne({
        where: { name: seed.hotelName },
      });
      if (!hotel) {
        throw new Error(
          `Hotel '${seed.hotelName}' not found. Run HotelSeeder first.`,
        );
      }

      const roomType = await this.roomTypeRepository.findOne({
        where: { name: seed.roomTypeName, hotelId: hotel.id },
      });
      if (!roomType) {
        throw new Error(
          `Room type '${seed.roomTypeName}' not found for hotel '${seed.hotelName}'. Run RoomTypeSeeder first.`,
        );
      }

      const existing = await this.rateOptionRepository.findOne({
        where: { name: seed.name, roomTypeId: roomType.id },
      });

      if (!existing) {
        await this.rateOptionRepository.save(
          this.rateOptionRepository.create({
            name: seed.name,
            description: seed.description,
            pricePerNight: seed.pricePerNight,
            currency: seed.currency,
            isRefundable: seed.isRefundable,
            cancellationPolicy: seed.cancellationPolicy,
            deadlineHours: seed.deadlineHours,
            roomTypeId: roomType.id,
          }),
        );
      }
    }
  }
}
