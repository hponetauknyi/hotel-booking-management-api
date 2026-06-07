import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from 'src/v1/hotel/entities/hotel.entity';
import { RoomType } from '../entities/room-type.entity';

interface RoomTypeSeed {
  hotelName: string;
  name: string;
  description: string;
  maxOccupancy: number;
  bedType: string;
  areaInSquareFeet: string;
}

@Injectable()
export class RoomTypeSeeder {
  constructor(
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async seed(): Promise<void> {
    const roomTypes: RoomTypeSeed[] = [
      // Yangon Grand Palace Hotel
      {
        hotelName: 'Yangon Grand Palace Hotel',
        name: 'Standard Twin',
        description:
          'Comfortable twin room with city views and modern amenities.',
        maxOccupancy: 2,
        bedType: 'Twin',
        areaInSquareFeet: '280',
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        name: 'Deluxe King',
        description:
          'Spacious king room with upgraded furnishings and city views.',
        maxOccupancy: 2,
        bedType: 'King',
        areaInSquareFeet: '380',
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        name: 'Executive Suite',
        description:
          'Expansive suite with separate living area, premium amenities, and panoramic city views.',
        maxOccupancy: 3,
        bedType: 'King',
        areaInSquareFeet: '650',
      },

      // Mandalay Royal View Hotel
      {
        hotelName: 'Mandalay Royal View Hotel',
        name: 'Superior Twin',
        description:
          'Well-appointed twin room with views toward Mandalay Palace.',
        maxOccupancy: 2,
        bedType: 'Twin',
        areaInSquareFeet: '300',
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        name: 'Deluxe Double',
        description:
          'Deluxe double room offering palace-view balcony and premium bath amenities.',
        maxOccupancy: 2,
        bedType: 'Double',
        areaInSquareFeet: '350',
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        name: 'Family Room',
        description:
          'Spacious family room with one king and one single bed, ideal for small families.',
        maxOccupancy: 4,
        bedType: 'King + Single',
        areaInSquareFeet: '520',
      },

      // Bagan Heritage Resort
      {
        hotelName: 'Bagan Heritage Resort',
        name: 'Garden Cottage',
        description:
          'Standalone cottage surrounded by tropical gardens with traditional Bagan decor.',
        maxOccupancy: 2,
        bedType: 'Queen',
        areaInSquareFeet: '400',
      },
      {
        hotelName: 'Bagan Heritage Resort',
        name: 'Temple View Villa',
        description:
          'Private villa with a terrace offering direct views of ancient Bagan temples.',
        maxOccupancy: 2,
        bedType: 'King',
        areaInSquareFeet: '580',
      },
      {
        hotelName: 'Bagan Heritage Resort',
        name: 'Pool Villa',
        description:
          'Luxury villa with a private plunge pool and unobstructed temple panorama.',
        maxOccupancy: 3,
        bedType: 'King',
        areaInSquareFeet: '900',
      },

      // Inle Lake Garden Hotel
      {
        hotelName: 'Inle Lake Garden Hotel',
        name: 'Garden View Room',
        description: 'Serene room overlooking manicured hotel gardens.',
        maxOccupancy: 2,
        bedType: 'Queen',
        areaInSquareFeet: '290',
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        name: 'Lake View Room',
        description:
          'Elevated room with direct views across the calm waters of Inle Lake.',
        maxOccupancy: 2,
        bedType: 'King',
        areaInSquareFeet: '340',
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        name: 'Over-water Bungalow',
        description:
          'Iconic stilted bungalow built directly over the lake with glass floor panels.',
        maxOccupancy: 2,
        bedType: 'King',
        areaInSquareFeet: '480',
      },

      // Ngapali Sunset Beach Hotel (inactive — seed room types anyway for admin use)
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        name: 'Beach Front Room',
        description:
          'Ground-floor room with direct beach access and ocean views.',
        maxOccupancy: 2,
        bedType: 'King',
        areaInSquareFeet: '360',
      },
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        name: 'Ocean Suite',
        description:
          'Elevated suite with wraparound terrace and uninterrupted Indian Ocean views.',
        maxOccupancy: 3,
        bedType: 'King',
        areaInSquareFeet: '700',
      },
    ];

    for (const seed of roomTypes) {
      const hotel = await this.hotelRepository.findOne({
        where: { name: seed.hotelName },
      });

      if (!hotel) {
        throw new Error(
          `Hotel '${seed.hotelName}' not found. Run HotelSeeder first.`,
        );
      }

      const existing = await this.roomTypeRepository.findOne({
        where: { name: seed.name, hotelId: hotel.id },
      });

      if (!existing) {
        await this.roomTypeRepository.save(
          this.roomTypeRepository.create({
            name: seed.name,
            description: seed.description,
            maxOccupancy: seed.maxOccupancy,
            bedType: seed.bedType,
            areaInSquareFeet: seed.areaInSquareFeet,
            hotelId: hotel.id,
          }),
        );
      }
    }
  }
}
