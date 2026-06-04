import { Module } from '@nestjs/common';
import { RateOptionService } from './services/rate-option.service';
import { RateOptionController } from './controllers/rate-option.controller';

@Module({
  providers: [RateOptionService],
  controllers: [RateOptionController],
})
export class RateOptionModule {}
