import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/v1/booking/entities/booking.entity';
import { StripeModule } from 'src/v1/stripe/stripe.module';
import { StripeProvider } from '../stripe/stripe.provider';
import { PaymentController } from './controllers/payment.controller';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './services/payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Booking]),
    StripeModule,
    ConfigModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, StripeProvider],
  exports: [PaymentService],
})
export class PaymentModule {}
