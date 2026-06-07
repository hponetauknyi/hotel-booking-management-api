import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from 'src/v1/hotel/entities/hotel.entity';
import { RoomType } from 'src/v1/room/entities/room-type.entity';
import { Benefit } from '../entities/benefit.entity';
import { RateOptionBenefit } from '../entities/rate-option-benefit.entity';
import { RateOption } from '../entities/rate-option.entity';

interface RateOptionBenefitSeed {
  hotelName: string;
  roomTypeName: string;
  rateOptionName: string;
  benefitNames: string[];
}

@Injectable()
export class RateOptionBenefitSeeder {
  constructor(
    @InjectRepository(RateOption)
    private rateOptionRepository: Repository<RateOption>,
    @InjectRepository(RateOptionBenefit)
    private rateOptionBenefitRepository: Repository<RateOptionBenefit>,
    @InjectRepository(Benefit)
    private benefitRepository: Repository<Benefit>,
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async seed(): Promise<void> {
    const mappings: RateOptionBenefitSeed[] = [
      // ── Yangon Grand Palace Hotel ──────────────────────────────────────────
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Standard Twin',
        rateOptionName: 'Room Only',
        benefitNames: ['Free Wi-Fi', 'Flexible Cancellation'],
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Standard Twin',
        rateOptionName: 'Non-Refundable',
        benefitNames: ['Free Wi-Fi'],
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Deluxe King',
        rateOptionName: 'Bed & Breakfast',
        benefitNames: [
          'Free Wi-Fi',
          'Breakfast Included',
          'Flexible Cancellation',
        ],
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Deluxe King',
        rateOptionName: 'Non-Refundable',
        benefitNames: ['Free Wi-Fi', 'Breakfast Included'],
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Executive Suite',
        rateOptionName: 'Suite with Breakfast',
        benefitNames: [
          'Free Wi-Fi',
          'Breakfast Included',
          'Welcome Amenity',
          'Room Upgrade',
          'Late Check-out',
          'Flexible Cancellation',
        ],
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Executive Suite',
        rateOptionName: 'Non-Refundable Suite',
        benefitNames: ['Free Wi-Fi', 'Breakfast Included', 'Welcome Amenity'],
      },

      // ── Mandalay Royal View Hotel ──────────────────────────────────────────
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Superior Twin',
        rateOptionName: 'Room Only',
        benefitNames: [
          'Free Wi-Fi',
          'Flexible Cancellation',
          'No Prepayment Required',
        ],
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Superior Twin',
        rateOptionName: 'Non-Refundable',
        benefitNames: ['Free Wi-Fi'],
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Deluxe Double',
        rateOptionName: 'Bed & Breakfast',
        benefitNames: [
          'Free Wi-Fi',
          'Breakfast Included',
          'Flexible Cancellation',
        ],
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Deluxe Double',
        rateOptionName: 'Non-Refundable',
        benefitNames: ['Free Wi-Fi', 'Breakfast Included'],
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Family Room',
        rateOptionName: 'Family Bed & Breakfast',
        benefitNames: [
          'Free Wi-Fi',
          'Breakfast Included',
          'Flexible Cancellation',
          'Free Parking',
        ],
      },

      // ── Bagan Heritage Resort ──────────────────────────────────────────────
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Garden Cottage',
        rateOptionName: 'Cottage Only',
        benefitNames: [
          'Free Wi-Fi',
          'Flexible Cancellation',
          'No Prepayment Required',
        ],
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Garden Cottage',
        rateOptionName: 'Non-Refundable',
        benefitNames: ['Free Wi-Fi'],
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Temple View Villa',
        rateOptionName: 'Half Board',
        benefitNames: [
          'Free Wi-Fi',
          'Breakfast Included',
          'Half Board',
          'Flexible Cancellation',
          'Daily Housekeeping',
        ],
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Temple View Villa',
        rateOptionName: 'Non-Refundable',
        benefitNames: [
          'Free Wi-Fi',
          'Breakfast Included',
          'Daily Housekeeping',
        ],
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Pool Villa',
        rateOptionName: 'All Inclusive',
        benefitNames: [
          'Free Wi-Fi',
          'All Inclusive',
          'Pool Access',
          'Spa Access',
          'Airport Transfer (Return)',
          'Welcome Amenity',
          'Late Check-out',
          'Early Check-in',
          'Flexible Cancellation',
          'Daily Housekeeping',
          'Turndown Service',
        ],
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Pool Villa',
        rateOptionName: 'Non-Refundable',
        benefitNames: [
          'Free Wi-Fi',
          'Breakfast Included',
          'Pool Access',
          'Welcome Amenity',
          'Daily Housekeeping',
        ],
      },

      // ── Inle Lake Garden Hotel ─────────────────────────────────────────────
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Garden View Room',
        rateOptionName: 'Room Only',
        benefitNames: [
          'Free Wi-Fi',
          'Flexible Cancellation',
          'No Prepayment Required',
        ],
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Garden View Room',
        rateOptionName: 'Non-Refundable',
        benefitNames: ['Free Wi-Fi'],
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Lake View Room',
        rateOptionName: 'Bed & Breakfast',
        benefitNames: [
          'Free Wi-Fi',
          'Breakfast Included',
          'Flexible Cancellation',
        ],
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Lake View Room',
        rateOptionName: 'Non-Refundable',
        benefitNames: ['Free Wi-Fi', 'Breakfast Included'],
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Over-water Bungalow',
        rateOptionName: 'Half Board',
        benefitNames: [
          'Free Wi-Fi',
          'Half Board',
          'Airport Transfer (One-way)',
          'Welcome Amenity',
          'Turndown Service',
          'Flexible Cancellation',
          'Daily Housekeeping',
        ],
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Over-water Bungalow',
        rateOptionName: 'Non-Refundable',
        benefitNames: [
          'Free Wi-Fi',
          'Breakfast Included',
          'Welcome Amenity',
          'Daily Housekeeping',
        ],
      },

      // ── Ngapali Sunset Beach Hotel ─────────────────────────────────────────
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Beach Front Room',
        rateOptionName: 'Room Only',
        benefitNames: [
          'Free Wi-Fi',
          'Flexible Cancellation',
          'No Prepayment Required',
          'Pool Access',
        ],
      },
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Beach Front Room',
        rateOptionName: 'Non-Refundable',
        benefitNames: ['Free Wi-Fi', 'Pool Access'],
      },
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Ocean Suite',
        rateOptionName: 'All Inclusive',
        benefitNames: [
          'Free Wi-Fi',
          'All Inclusive',
          'Pool Access',
          'Spa Access',
          'Gym Access',
          'Airport Transfer (Return)',
          'Welcome Amenity',
          'Room Upgrade',
          'Early Check-in',
          'Late Check-out',
          'Flexible Cancellation',
          'Daily Housekeeping',
          'Turndown Service',
        ],
      },
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Ocean Suite',
        rateOptionName: 'Non-Refundable',
        benefitNames: [
          'Free Wi-Fi',
          'Breakfast Included',
          'Pool Access',
          'Welcome Amenity',
          'Daily Housekeeping',
        ],
      },
    ];

    for (const mapping of mappings) {
      const hotel = await this.hotelRepository.findOne({
        where: { name: mapping.hotelName },
      });
      if (!hotel) {
        throw new Error(
          `Hotel '${mapping.hotelName}' not found. Run HotelSeeder first.`,
        );
      }

      const roomType = await this.roomTypeRepository.findOne({
        where: { name: mapping.roomTypeName, hotelId: hotel.id },
      });
      if (!roomType) {
        throw new Error(
          `Room type '${mapping.roomTypeName}' not found. Run RoomTypeSeeder first.`,
        );
      }

      const rateOption = await this.rateOptionRepository.findOne({
        where: { name: mapping.rateOptionName, roomTypeId: roomType.id },
      });
      if (!rateOption) {
        throw new Error(
          `Rate option '${mapping.rateOptionName}' not found. Run RateOptionSeeder first.`,
        );
      }

      for (const benefitName of mapping.benefitNames) {
        const benefit = await this.benefitRepository.findOne({
          where: { name: benefitName },
        });
        if (!benefit) {
          throw new Error(
            `Benefit '${benefitName}' not found. Run BenefitSeeder first.`,
          );
        }

        const existing = await this.rateOptionBenefitRepository.findOne({
          where: { rateOptionId: rateOption.id, benefitId: benefit.id },
        });

        if (!existing) {
          await this.rateOptionBenefitRepository.save(
            this.rateOptionBenefitRepository.create({
              rateOptionId: rateOption.id,
              benefitId: benefit.id,
            }),
          );
        }
      }
    }
  }
}
