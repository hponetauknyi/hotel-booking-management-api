import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/v1/hotel/entities/hotel.entity';
import { Repository } from 'typeorm';
import { RoomType } from '../entities/room-type.entity';
import { Room, RoomStatus } from '../entities/room.entity';

interface RoomSeed {
  hotelName: string;
  roomTypeName: string;
  roomNumber: string;
  floorNumber: number;
  status: RoomStatus;
}

@Injectable()
export class RoomSeeder {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async seed(): Promise<void> {
    const rooms: RoomSeed[] = [
      // ── Yangon Grand Palace Hotel ──────────────────────────────────────────
      // Standard Twin  — floors 2–4, rooms x01–x04
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Standard Twin',
        roomNumber: '201',
        floorNumber: 2,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Standard Twin',
        roomNumber: '202',
        floorNumber: 2,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Standard Twin',
        roomNumber: '203',
        floorNumber: 2,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Standard Twin',
        roomNumber: '204',
        floorNumber: 2,
        status: RoomStatus.MAINTENANCE,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Standard Twin',
        roomNumber: '301',
        floorNumber: 3,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Standard Twin',
        roomNumber: '302',
        floorNumber: 3,
        status: RoomStatus.AVAILABLE,
      },
      // Deluxe King  — floors 5–6
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Deluxe King',
        roomNumber: '501',
        floorNumber: 5,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Deluxe King',
        roomNumber: '502',
        floorNumber: 5,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Deluxe King',
        roomNumber: '503',
        floorNumber: 5,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Deluxe King',
        roomNumber: '601',
        floorNumber: 6,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Deluxe King',
        roomNumber: '602',
        floorNumber: 6,
        status: RoomStatus.OCCUPIED,
      },
      // Executive Suite  — floor 10
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Executive Suite',
        roomNumber: '1001',
        floorNumber: 10,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Yangon Grand Palace Hotel',
        roomTypeName: 'Executive Suite',
        roomNumber: '1002',
        floorNumber: 10,
        status: RoomStatus.AVAILABLE,
      },

      // ── Mandalay Royal View Hotel ──────────────────────────────────────────
      // Superior Twin
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Superior Twin',
        roomNumber: '101',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Superior Twin',
        roomNumber: '102',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Superior Twin',
        roomNumber: '103',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Superior Twin',
        roomNumber: '201',
        floorNumber: 2,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Superior Twin',
        roomNumber: '202',
        floorNumber: 2,
        status: RoomStatus.MAINTENANCE,
      },
      // Deluxe Double
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Deluxe Double',
        roomNumber: '301',
        floorNumber: 3,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Deluxe Double',
        roomNumber: '302',
        floorNumber: 3,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Deluxe Double',
        roomNumber: '303',
        floorNumber: 3,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Deluxe Double',
        roomNumber: '401',
        floorNumber: 4,
        status: RoomStatus.OCCUPIED,
      },
      // Family Room
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Family Room',
        roomNumber: '501',
        floorNumber: 5,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Mandalay Royal View Hotel',
        roomTypeName: 'Family Room',
        roomNumber: '502',
        floorNumber: 5,
        status: RoomStatus.AVAILABLE,
      },

      // ── Bagan Heritage Resort ──────────────────────────────────────────────
      // Garden Cottage — single-storey (floor 1)
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Garden Cottage',
        roomNumber: 'GC-01',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Garden Cottage',
        roomNumber: 'GC-02',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Garden Cottage',
        roomNumber: 'GC-03',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Garden Cottage',
        roomNumber: 'GC-04',
        floorNumber: 1,
        status: RoomStatus.MAINTENANCE,
      },
      // Temple View Villa
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Temple View Villa',
        roomNumber: 'TV-01',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Temple View Villa',
        roomNumber: 'TV-02',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Temple View Villa',
        roomNumber: 'TV-03',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      // Pool Villa
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Pool Villa',
        roomNumber: 'PV-01',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Bagan Heritage Resort',
        roomTypeName: 'Pool Villa',
        roomNumber: 'PV-02',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },

      // ── Inle Lake Garden Hotel ─────────────────────────────────────────────
      // Garden View Room
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Garden View Room',
        roomNumber: '101',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Garden View Room',
        roomNumber: '102',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Garden View Room',
        roomNumber: '103',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Garden View Room',
        roomNumber: '201',
        floorNumber: 2,
        status: RoomStatus.AVAILABLE,
      },
      // Lake View Room
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Lake View Room',
        roomNumber: '301',
        floorNumber: 3,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Lake View Room',
        roomNumber: '302',
        floorNumber: 3,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Lake View Room',
        roomNumber: '303',
        floorNumber: 3,
        status: RoomStatus.OCCUPIED,
      },
      // Over-water Bungalow
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Over-water Bungalow',
        roomNumber: 'OW-01',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Over-water Bungalow',
        roomNumber: 'OW-02',
        floorNumber: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        hotelName: 'Inle Lake Garden Hotel',
        roomTypeName: 'Over-water Bungalow',
        roomNumber: 'OW-03',
        floorNumber: 1,
        status: RoomStatus.MAINTENANCE,
      },

      // ── Ngapali Sunset Beach Hotel (inactive) ──────────────────────────────
      // Rooms seeded for admin reference; hotel is not publicly bookable
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Beach Front Room',
        roomNumber: 'BF-01',
        floorNumber: 1,
        status: RoomStatus.OUT_OF_SERVICE,
      },
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Beach Front Room',
        roomNumber: 'BF-02',
        floorNumber: 1,
        status: RoomStatus.OUT_OF_SERVICE,
      },
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Beach Front Room',
        roomNumber: 'BF-03',
        floorNumber: 1,
        status: RoomStatus.OUT_OF_SERVICE,
      },
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Ocean Suite',
        roomNumber: 'OS-01',
        floorNumber: 2,
        status: RoomStatus.OUT_OF_SERVICE,
      },
      {
        hotelName: 'Ngapali Sunset Beach Hotel',
        roomTypeName: 'Ocean Suite',
        roomNumber: 'OS-02',
        floorNumber: 2,
        status: RoomStatus.OUT_OF_SERVICE,
      },
    ];

    for (const seed of rooms) {
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
          `Room type '${seed.roomTypeName}' not found. Run RoomTypeSeeder first.`,
        );
      }

      const existing = await this.roomRepository.findOne({
        where: { hotelId: hotel.id, roomNumber: seed.roomNumber },
      });

      if (!existing) {
        await this.roomRepository.save(
          this.roomRepository.create({
            hotelId: hotel.id,
            roomTypeId: roomType.id,
            roomNumber: seed.roomNumber,
            floorNumber: seed.floorNumber,
            status: seed.status,
          }),
        );
      }
    }
  }
}
