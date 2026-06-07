import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from 'src/v1/hotel/entities/hotel.entity';
import { RoomCharacteristic } from '../entities/room-characteristic.entity';
import { RoomTypeCharacteristic } from '../entities/room-type-characteristic.entity';
import { RoomType } from '../entities/room-type.entity';

interface RoomTypeCharacteristicSeed {
  hotelName: string;
  roomTypeName: string;
  characteristicNames: string[];
}

@Injectable()
export class RoomTypeCharacteristicSeeder {
  constructor(
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(RoomCharacteristic)
    private roomCharacteristicRepository: Repository<RoomCharacteristic>,
    @InjectRepository(RoomTypeCharacteristic)
    private roomTypeCharacteristicRepository: Repository<RoomTypeCharacteristic>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async seed(): Promise<void> {
    const BASE = [
      'Free Wi-Fi',
      'Air Conditioning',
      'Flat-screen TV',
      'Private Bathroom',
      'Hot Water',
      'In-room Safe',
      'Smoke Detector',
      'Non-smoking',
      'Blackout Curtains',
    ];

    const mappings: RoomTypeCharacteristicSeed[] = [
      // ── Yangon Grand Palace Hotel ──────────────────────────────────────────
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Standard Twin',
        characteristicNames: [...BASE, 'Work Desk', 'City View'],
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Deluxe King',
        characteristicNames: [
          ...BASE,
          'Work Desk',
          'Coffee & Tea Maker',
          'Minibar',
          'City View',
          'Bathtub',
        ],
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Executive Suite',
        characteristicNames: [
          ...BASE,
          'Work Desk',
          'USB Charging Ports',
          'Coffee & Tea Maker',
          'Minibar',
          'Refrigerator',
          'City View',
          'Private Balcony',
          'Bathtub',
          'Walk-in Shower',
        ],
      },

      // ── Mandalay Royal View Hotel ──────────────────────────────────────────
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Superior Twin',
        characteristicNames: [...BASE, 'Work Desk', 'City View'],
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Deluxe Double',
        characteristicNames: [
          ...BASE,
          'Work Desk',
          'Coffee & Tea Maker',
          'Minibar',
          'City View',
          'Private Balcony',
          'Bathtub',
        ],
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Family Room',
        characteristicNames: [
          ...BASE,
          'Work Desk',
          'Coffee & Tea Maker',
          'Refrigerator',
          'City View',
        ],
      },

      // ── Bagan Heritage Resort ──────────────────────────────────────────────
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Garden Cottage',
        characteristicNames: [
          ...BASE,
          'Coffee & Tea Maker',
          'Garden View',
          'Private Balcony',
          'Ceiling Fan',
        ],
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Temple View Villa',
        characteristicNames: [
          ...BASE,
          'Coffee & Tea Maker',
          'Minibar',
          'Garden View',
          'Private Balcony',
          'Bathtub',
          'Ceiling Fan',
        ],
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Pool Villa',
        characteristicNames: [
          ...BASE,
          'Coffee & Tea Maker',
          'Minibar',
          'Refrigerator',
          'Garden View',
          'Private Balcony',
          'Bathtub',
          'Walk-in Shower',
          'USB Charging Ports',
          'Pool View',
        ],
      },

      // ── Inle Lake Garden Hotel ─────────────────────────────────────────────
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Garden View Room',
        characteristicNames: [...BASE, 'Coffee & Tea Maker', 'Garden View'],
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Lake View Room',
        characteristicNames: [
          ...BASE,
          'Coffee & Tea Maker',
          'Minibar',
          'Private Balcony',
        ],
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Over-water Bungalow',
        characteristicNames: [
          ...BASE,
          'Coffee & Tea Maker',
          'Minibar',
          'Refrigerator',
          'Private Balcony',
          'Bathtub',
          'Walk-in Shower',
          'USB Charging Ports',
        ],
      },

      // ── Ngapali Sunset Beach Hotel ─────────────────────────────────────────
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Beach Front Room',
        characteristicNames: [
          ...BASE,
          'Coffee & Tea Maker',
          'Minibar',
          'Sea View',
          'Private Balcony',
        ],
      },
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Ocean Suite',
        characteristicNames: [
          ...BASE,
          'Coffee & Tea Maker',
          'Minibar',
          'Refrigerator',
          'Sea View',
          'Private Balcony',
          'Bathtub',
          'Walk-in Shower',
          'USB Charging Ports',
          'Work Desk',
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
          `Room type '${mapping.roomTypeName}' not found for hotel '${mapping.hotelName}'. Run RoomTypeSeeder first.`,
        );
      }

      for (const charName of mapping.characteristicNames) {
        const characteristic = await this.roomCharacteristicRepository.findOne({
          where: { name: charName },
        });
        if (!characteristic) {
          throw new Error(
            `Room characteristic '${charName}' not found. Run RoomCharacteristicSeeder first.`,
          );
        }

        const existing = await this.roomTypeCharacteristicRepository.findOne({
          where: {
            roomTypeId: roomType.id,
            roomCharacteristicId: characteristic.id,
          },
        });

        if (!existing) {
          await this.roomTypeCharacteristicRepository.save(
            this.roomTypeCharacteristicRepository.create({
              roomTypeId: roomType.id,
              roomCharacteristicId: characteristic.id,
            }),
          );
        }
      }
    }
  }
}
