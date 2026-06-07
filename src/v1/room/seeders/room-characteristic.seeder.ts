import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomCharacteristic } from '../entities/room-characteristic.entity';

interface RoomCharacteristicSeed {
  name: string;
  description: string;
}

@Injectable()
export class RoomCharacteristicSeeder {
  constructor(
    @InjectRepository(RoomCharacteristic)
    private roomCharacteristicRepository: Repository<RoomCharacteristic>,
  ) {}

  async seed(): Promise<void> {
    const characteristics: RoomCharacteristicSeed[] = [
      // Connectivity
      {
        name: 'Free Wi-Fi',
        description: 'Complimentary high-speed wireless internet access.',
      },
      {
        name: 'Wired Internet',
        description: 'High-speed wired LAN connection available in the room.',
      },

      // Climate & Comfort
      {
        name: 'Air Conditioning',
        description: 'Individual climate control unit in the room.',
      },
      {
        name: 'Heating',
        description: 'In-room heating system for colder climates.',
      },
      {
        name: 'Ceiling Fan',
        description: 'Ceiling fan for additional air circulation.',
      },

      // Bathroom
      {
        name: 'Private Bathroom',
        description: 'En-suite bathroom exclusively for the room guests.',
      },
      {
        name: 'Bathtub',
        description: 'Full-size soaking or jetted bathtub.',
      },
      {
        name: 'Walk-in Shower',
        description: 'Separate walk-in shower with rain or power head.',
      },
      {
        name: 'Hot Water',
        description: '24-hour hot water supply.',
      },

      // Entertainment
      {
        name: 'Flat-screen TV',
        description: 'Flat-screen television with cable or satellite channels.',
      },
      {
        name: 'Streaming Services',
        description: 'Smart TV with access to popular streaming platforms.',
      },

      // Workspace
      {
        name: 'Work Desk',
        description: 'Dedicated desk and chair for working.',
      },
      {
        name: 'USB Charging Ports',
        description: 'Built-in USB charging ports at the bedside or desk.',
      },

      // Safety & Security
      {
        name: 'In-room Safe',
        description: 'Electronic safe for storing valuables.',
      },
      {
        name: 'Smoke Detector',
        description: 'Compliant smoke detection system.',
      },
      {
        name: 'Blackout Curtains',
        description: 'Heavy blackout drapes for complete light blocking.',
      },

      // Views & Access
      {
        name: 'Sea View',
        description: 'Direct view of the sea or ocean from the room.',
      },
      {
        name: 'Pool View',
        description: 'Overlooks the hotel swimming pool.',
      },
      {
        name: 'City View',
        description: 'Panoramic view of the city skyline.',
      },
      {
        name: 'Garden View',
        description: 'Scenic view of hotel gardens or grounds.',
      },
      {
        name: 'Private Balcony',
        description: 'Private outdoor balcony or terrace.',
      },

      // Amenities
      {
        name: 'Minibar',
        description: 'In-room minibar stocked with beverages and snacks.',
      },
      {
        name: 'Coffee & Tea Maker',
        description: 'Kettle or coffee machine with complimentary supplies.',
      },
      {
        name: 'Refrigerator',
        description: 'Dedicated mini-fridge for storing personal items.',
      },
      {
        name: 'Microwave',
        description: 'Compact microwave oven in the room.',
      },

      // Accessibility
      {
        name: 'Accessible Room',
        description:
          'Room designed for guests with mobility impairments; wide doorways and grab bars.',
      },
      {
        name: 'Non-smoking',
        description: 'Designated non-smoking room.',
      },
      {
        name: 'Pet Friendly',
        description: 'Room that accommodates pets.',
      },
    ];

    for (const seed of characteristics) {
      const existing = await this.roomCharacteristicRepository.findOne({
        where: { name: seed.name },
      });

      if (!existing) {
        await this.roomCharacteristicRepository.save(
          this.roomCharacteristicRepository.create(seed),
        );
      }
    }
  }
}
