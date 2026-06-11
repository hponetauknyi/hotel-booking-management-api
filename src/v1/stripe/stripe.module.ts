import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeProvider } from './stripe.provider';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule],
  providers: [StripeProvider, StripeService],
  exports: [StripeService],
})
export class StripeModule {}
