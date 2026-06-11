import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from './stripe.constants';

export const StripeProvider = {
  provide: STRIPE_CLIENT,
  inject: [ConfigService],

  useFactory: (config: ConfigService): Stripe.Stripe => {
    return new Stripe(config.getOrThrow('STRIPE_SECRET_KEY'));
  },
};
