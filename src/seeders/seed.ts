import { NestFactory } from '@nestjs/core';
import { AuthSeeder } from '../v1/auth/seeders/auth.seeder';
import { HotelSeeder } from '../v1/hotel/seeders/hotel.seeder';
import { SettingSeeder } from '../v1/setting/seeders/setting.seeder';
import { SeederModule } from './seeder.module';
import { RoomCharacteristicSeeder } from 'src/v1/room/seeders/room-characteristic.seeder';
import { RoomTypeSeeder } from 'src/v1/room/seeders/room-type.seeder';
import { RoomTypeCharacteristicSeeder } from 'src/v1/room/seeders/room-type-characteristic.seeder';
import { RoomSeeder } from 'src/v1/room/seeders/room.seeder';
import { BenefitSeeder } from 'src/v1/rate-option/seeders/benefit.seeder';
import { RateOptionSeeder } from 'src/v1/rate-option/seeders/rate-option.seeder';
import { RateOptionBenefitSeeder } from 'src/v1/rate-option/seeders/rate-option-benefit.seeder';

async function runSeeders() {
  console.log('Starting database seeding...');

  const app = await NestFactory.createApplicationContext(SeederModule);

  try {
    const authSeeder = app.get(AuthSeeder);
    const hotelSeeder = app.get(HotelSeeder);
    const roomCharacteristicSeeder = app.get(RoomCharacteristicSeeder);
    const roomTypeSeeder = app.get(RoomTypeSeeder);
    const roomTypeCharacteristicSeeder = app.get(RoomTypeCharacteristicSeeder);
    const roomSeeder = app.get(RoomSeeder);
    const benefitSeeder = app.get(BenefitSeeder);
    const rateOptionSeeder = app.get(RateOptionSeeder);
    const rateOptionBenefitSeeder = app.get(RateOptionBenefitSeeder);
    const settingSeeder = app.get(SettingSeeder);

    console.log('Seeding authentication data (roles, permissions, users)...');
    await authSeeder.seed();
    console.log('Authentication seeding completed');

    console.log('Seeding hotels...');
    await hotelSeeder.seed();
    console.log('Hotel seeding completed');

    console.log('Seeding room characteristics...');
    await roomCharacteristicSeeder.seed();
    console.log('Room characteristics seeding completed');

    console.log('Seeding room types...');
    await roomTypeSeeder.seed();
    console.log('Room types seeding completed');

    console.log('Seeding room type-characteristic mappings...');
    await roomTypeCharacteristicSeeder.seed();
    console.log('Room type-characteristic mappings seeding completed');

    console.log('Seeding rooms...');
    await roomSeeder.seed();
    console.log('Rooms seeding completed');

    console.log('Seeding rate option benefits...');
    await benefitSeeder.seed();
    console.log('Rate option benefits seeding completed');

    console.log('Seeding rate options...');
    await rateOptionSeeder.seed();
    console.log('Rate options seeding completed');

    console.log('Seeding rate option-benefit mappings...');
    await rateOptionBenefitSeeder.seed();
    console.log('Rate option-benefit mappings seeding completed');

    console.log('Seeding application settings...');
    await settingSeeder.seed();
    console.log('Settings seeding completed');

    console.log('All seeders completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSeeders().catch((error) => {
  console.error('Fatal error during seeding:', error);
  process.exit(1);
});
