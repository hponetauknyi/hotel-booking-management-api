import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Benefit } from '../entities/benefit.entity';

interface BenefitSeed {
  name: string;
  description: string;
}

@Injectable()
export class BenefitSeeder {
  constructor(
    @InjectRepository(Benefit)
    private benefitRepository: Repository<Benefit>,
  ) {}

  async seed(): Promise<void> {
    const benefits: BenefitSeed[] = [
      // Meals
      {
        name: 'Breakfast Included',
        description:
          'Daily buffet or set breakfast for all guests in the room.',
      },
      {
        name: 'Half Board',
        description: 'Breakfast and dinner included in the rate.',
      },
      {
        name: 'Full Board',
        description: 'Breakfast, lunch, and dinner included.',
      },
      {
        name: 'All Inclusive',
        description:
          'All meals, snacks, and selected beverages included throughout the stay.',
      },

      // Transfers & Transport
      {
        name: 'Airport Transfer (One-way)',
        description: 'Complimentary one-way airport pickup or drop-off.',
      },
      {
        name: 'Airport Transfer (Return)',
        description: 'Complimentary return airport transfers.',
      },
      {
        name: 'Free Parking',
        description: 'On-site parking at no extra charge.',
      },

      // Wellness & Recreation
      {
        name: 'Spa Access',
        description: 'Complimentary access to the hotel spa facilities.',
      },
      {
        name: 'Gym Access',
        description: 'Unlimited use of the fitness centre during the stay.',
      },
      {
        name: 'Pool Access',
        description: 'Access to hotel swimming pool(s).',
      },

      // Room Perks
      {
        name: 'Early Check-in',
        description: 'Guaranteed early check-in subject to availability.',
      },
      {
        name: 'Late Check-out',
        description: 'Guaranteed late check-out up to 2 PM.',
      },
      {
        name: 'Room Upgrade',
        description:
          'Complimentary room upgrade on arrival, subject to availability.',
      },
      {
        name: 'Welcome Amenity',
        description: 'Complimentary welcome gift or amenity upon arrival.',
      },
      {
        name: 'Turndown Service',
        description: 'Nightly turndown service with chocolates or amenities.',
      },
      {
        name: 'Daily Housekeeping',
        description: 'Full daily room cleaning service.',
      },

      // Connectivity
      {
        name: 'Free Wi-Fi',
        description:
          'Complimentary high-speed internet throughout the property.',
      },

      // Loyalty & Extras
      {
        name: 'Loyalty Points',
        description: 'Rate earns hotel loyalty programme points.',
      },
      {
        name: 'Flexible Cancellation',
        description:
          'Free cancellation up to the deadline specified in the policy.',
      },
      {
        name: 'No Prepayment Required',
        description: 'Pay at the property; no upfront charge.',
      },
    ];

    for (const seed of benefits) {
      const existing = await this.benefitRepository.findOne({
        where: { name: seed.name },
      });

      if (!existing) {
        await this.benefitRepository.save(this.benefitRepository.create(seed));
      }
    }
  }
}
