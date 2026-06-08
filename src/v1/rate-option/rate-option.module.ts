import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from 'src/v1/room/entities/room-type.entity';
import { RateOptionController } from './controllers/rate-option.controller';
import { Benefit } from './entities/benefit.entity';
import { RateOptionBenefit } from './entities/rate-option-benefit.entity';
import { RateOption } from './entities/rate-option.entity';
import { RateOptionService } from './services/rate-option.service';
import { BenefitController } from './controllers/benefit.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RateOption,
      RateOptionBenefit,
      Benefit,
      RoomType,
    ]),
  ],
  controllers: [RateOptionController, BenefitController],
  providers: [RateOptionService],
  exports: [RateOptionService],
})
export class RateOptionModule {}
