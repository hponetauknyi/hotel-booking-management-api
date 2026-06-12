import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Benefit } from 'src/v1/rate-option/entities/benefit.entity';
import { RateOptionBenefit } from 'src/v1/rate-option/entities/rate-option-benefit.entity';
import { RateOption } from 'src/v1/rate-option/entities/rate-option.entity';
import { BenefitSeeder } from 'src/v1/rate-option/seeders/benefit.seeder';
import { RateOptionBenefitSeeder } from 'src/v1/rate-option/seeders/rate-option-benefit.seeder';
import { RateOptionSeeder } from 'src/v1/rate-option/seeders/rate-option.seeder';
import { RoomCharacteristic } from 'src/v1/room/entities/room-characteristic.entity';
import { RoomTypeCharacteristic } from 'src/v1/room/entities/room-type-characteristic.entity';
import { RoomType } from 'src/v1/room/entities/room-type.entity';
import { Room } from 'src/v1/room/entities/room.entity';
import { RoomCharacteristicSeeder } from 'src/v1/room/seeders/room-characteristic.seeder';
import { RoomTypeCharacteristicSeeder } from 'src/v1/room/seeders/room-type-characteristic.seeder';
import { RoomTypeSeeder } from 'src/v1/room/seeders/room-type.seeder';
import { RoomSeeder } from 'src/v1/room/seeders/room.seeder';
import { envValidationSchema } from '../common/config/env.validation';
import dataSource from '../data-source';
import { Admin } from '../v1/admin/entities/admin.entity';
import { ModuleEntity } from '../v1/auth/entities/module.entity';
import { Permission } from '../v1/auth/entities/permission.entity';
import { RolePermission } from '../v1/auth/entities/role-permission.entity';
import { Role } from '../v1/auth/entities/role.entity';
import { AuthSeeder } from '../v1/auth/seeders/auth.seeder';
import { Hotel } from '../v1/hotel/entities/hotel.entity';
import { HotelSeeder } from '../v1/hotel/seeders/hotel.seeder';
import { Setting } from '../v1/setting/entities/setting.entity';
import { SettingSeeder } from '../v1/setting/seeders/setting.seeder';
import { User } from '../v1/user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false,
        convert: true,
      },
    }),
    TypeOrmModule.forRoot({
      ...dataSource.options,
    }),
    TypeOrmModule.forFeature([
      Admin,
      ModuleEntity,
      Permission,
      Role,
      RolePermission,
      Hotel,
      Setting,
      User,
      Benefit,
      RateOptionBenefit,
      RateOption,
      RoomTypeCharacteristic,
      RoomCharacteristic,
      RoomType,
      Room,
    ]),
  ],
  providers: [
    AuthSeeder,
    HotelSeeder,
    SettingSeeder,
    BenefitSeeder,
    RateOptionSeeder,
    RateOptionBenefitSeeder,
    RoomSeeder,
    RoomTypeSeeder,
    RoomCharacteristicSeeder,
    RoomTypeCharacteristicSeeder,
  ],
})
export class SeederModule {}
