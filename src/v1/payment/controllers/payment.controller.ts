import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUser } from 'src/v1/auth/decorators/current-user.decorator';
import { RequirePermissions } from 'src/v1/auth/decorators/permissions.decorator';
import { PermissionModule } from 'src/v1/auth/entities/permission.entity';
import { PermissionsGuard } from 'src/v1/auth/guards/permissions.guard';
import { AuthenticatedUser } from 'src/v1/auth/interfaces/user.interface';
import { LogAction } from 'src/v1/log/constants/log-action.enum';
import { LogActivity } from 'src/v1/log/decorators/log-activity.decorator';
import { STRIPE_CLIENT } from 'src/v1/stripe/stripe.constants';
import Stripe from 'stripe';
import { ConfirmCashPaymentDto } from '../dto/confirm-cash-payment.dto';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';
import { FilterPaymentDto } from '../dto/filter-payment.dto';
import { PaymentService } from '../services/payment.service';

@Controller({ path: 'payments', version: '1' })
@ApiBearerAuth('jwt-auth')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @Inject(STRIPE_CLIENT)
    private readonly stripeClient: Stripe.Stripe,
    private readonly configService: ConfigService,
  ) {}

  // ─── Create Stripe PaymentIntent ─────────────────────────────────────────────

  @Post('intent')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({
    module: PermissionModule.PAYMENTS,
    permission: 'create',
  })
  @LogActivity({
    action: LogAction.CREATE,
    description: 'Payment intent created for booking',
    resourceType: 'Payment',
  })
  @ApiOperation({ summary: 'Create a Stripe PaymentIntent for a booking' })
  async createIntent(
    @Body() dto: CreatePaymentIntentDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.paymentService.createPaymentIntent(dto, currentUser);
  }

  @Post('webhook/stripe')
  @ApiOperation({ summary: 'Stripe webhook receiver (no auth)' })
  async stripeWebhook(@Req() req: RawBodyRequest<Request>): Promise<void> {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = this.configService.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event: any;
    try {
      event = this.stripeClient.webhooks.constructEvent(
        req.rawBody!,
        sig,
        webhookSecret,
      );
    } catch (err: any) {
      throw new BadRequestException(
        `Webhook signature verification failed: ${err.message}`,
      );
    }

    await this.paymentService.handleStripeWebhook(event);
  }

  @Post('confirm-cash')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({
    module: PermissionModule.PAYMENTS,
    permission: 'create',
  })
  @LogActivity({
    action: LogAction.CREATE,
    description: 'Admin confirmed cash payment for booking',
    resourceType: 'Payment',
  })
  @ApiOperation({
    summary: 'Admin: record a physical/cash payment and confirm the booking',
  })
  async confirmCash(
    @Body() dto: ConfirmCashPaymentDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.paymentService.confirmCashPayment(dto, currentUser);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: PermissionModule.PAYMENTS, permission: 'read' })
  @ApiOperation({ summary: 'List payments (guests see own; admins see all)' })
  async findAll(
    @Query() filter: FilterPaymentDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.paymentService.findAll(filter, currentUser);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: PermissionModule.PAYMENTS, permission: 'read' })
  @ApiOperation({ summary: 'Get a single payment by ID' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.paymentService.findOne(id, currentUser);
  }
}
