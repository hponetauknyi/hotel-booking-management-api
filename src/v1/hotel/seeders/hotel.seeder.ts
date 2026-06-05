import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/v1/admin/entities/admin.entity';
import { Repository } from 'typeorm';
import { Hotel } from '../entities/hotel.entity';

interface HotelSeed {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  checkInTime: string;
  checkOutTime: string;
  isActive: boolean;
}

@Injectable()
export class HotelSeeder {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async seed(): Promise<void> {
    const admin = await this.adminRepository.findOne({
      where: [{ email: 'arkarmin@obs.com.mm' }, { email: 'admin@obs.com.mm' }],
      order: { createdAt: 'ASC' },
    });

    if (!admin) {
      throw new Error('Admin user is required before seeding hotels');
    }

    const hotels: HotelSeed[] = [
      {
        name: 'Yangon Grand Palace Hotel',
        description: 'Central Yangon hotel close to business districts.',
        latitude: '16.84090000',
        longitude: '96.17350000',
        address: 'No. 123 Sule Pagoda Road',
        city: 'Yangon',
        country: 'Myanmar',
        postalCode: '11182',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        isActive: true,
      },
      {
        name: 'Mandalay Royal View Hotel',
        description: 'Comfortable stay near Mandalay Palace.',
        latitude: '21.95880000',
        longitude: '96.08910000',
        address: 'No. 45 26th Street',
        city: 'Mandalay',
        country: 'Myanmar',
        postalCode: '05021',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        isActive: true,
      },
      {
        name: 'Bagan Heritage Resort',
        description: 'Resort-style hotel near the Bagan temple area.',
        latitude: '21.17170000',
        longitude: '94.85850000',
        address: 'Anawrahta Road, New Bagan',
        city: 'Bagan',
        country: 'Myanmar',
        postalCode: '05231',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        isActive: true,
      },
      {
        name: 'Inle Lake Garden Hotel',
        description: 'Quiet lakeside hotel with garden views.',
        latitude: '20.58630000',
        longitude: '96.91020000',
        address: 'Khaung Daing Village',
        city: 'Nyaung Shwe',
        country: 'Myanmar',
        postalCode: '06081',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        isActive: true,
      },
      {
        name: 'Ngapali Sunset Beach Hotel',
        description: 'Beachfront property currently unavailable for booking.',
        latitude: '18.43680000',
        longitude: '94.31960000',
        address: 'Mya Pyin Village, Ngapali Beach',
        city: 'Ngapali',
        country: 'Myanmar',
        postalCode: '07172',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        isActive: false,
      },
    ];

    for (const hotelSeed of hotels) {
      const existing = await this.hotelRepository.findOne({
        where: { name: hotelSeed.name },
      });

      if (!existing) {
        await this.hotelRepository.save(
          this.hotelRepository.create({
            ...hotelSeed,
            createdBy: admin.id,
          }),
        );
      }
    }
  }
}
