import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedUser } from 'src/v1/auth/interfaces/user.interface';
import { Booking, BookingStatus } from 'src/v1/booking/entities/booking.entity';
import { StripeService } from 'src/v1/stripe/stripe.service';
import { Repository } from 'typeorm';
import { ConfirmCashPaymentDto } from '../dto/confirm-cash-payment.dto';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';
import { FilterPaymentDto } from '../dto/filter-payment.dto';
import {
  Payment,
  PaymentProvider,
  PaymentStatus,
} from '../entities/payment.entity';

const toStripeAmount = (decimalPrice: string): number =>
  Math.round(parseFloat(decimalPrice) * 100);

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly stripeService: StripeService,
  ) {}

  async createPaymentIntent(
    dto: CreatePaymentIntentDto,
    currentUser: AuthenticatedUser,
  ): Promise<{ clientSecret: string; paymentId: string }> {
    const booking = await this.bookingRepository.findOne({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException(
        `Booking with ID '${dto.bookingId}' not found`,
      );
    }

    // TO-DO: check if I can use @CheckOwnership decorator here
    const isAdmin = currentUser.subjectType === 'ADMIN';
    if (!isAdmin && booking.userId !== currentUser.id) {
      throw new ForbiddenException(
        'You are not allowed to pay for this booking',
      );
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        `Payment can only be initiated for PENDING bookings. Current status: '${booking.status}'`,
      );
    }

    const existingPending = await this.paymentRepository.findOne({
      where: { bookingId: booking.id, status: PaymentStatus.PENDING },
    });
    if (existingPending) {
      throw new BadRequestException(
        `A pending payment already exists for this booking. Please complete or cancel it before creating a new one.`,
      );
    }

    const currency = booking.currency.toLowerCase();
    const amount = toStripeAmount(booking.totalPrice);

    let stripeIntentId: string;
    let stripeClientSecret: string;

    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(
        amount,
        currency,
        { bookingId: booking.id, userId: currentUser.id },
      );
      stripeIntentId = paymentIntent.id;
      stripeClientSecret = paymentIntent.client_secret!;
    } catch (err: unknown) {
      this.logger.error(
        'Failed to create Stripe PaymentIntent',
        err instanceof Error ? err.stack : String(err),
      );
      throw new InternalServerErrorException(
        'Failed to initialise payment. Please try again.',
      );
    }

    const payment = this.paymentRepository.create({
      bookingId: booking.id,
      userId: currentUser.id,
      provider: PaymentProvider.STRIPE,
      paymentIntentId: stripeIntentId,
      amount: booking.totalPrice,
      currency: booking.currency,
      status: PaymentStatus.PENDING,
    });

    await this.paymentRepository.save(payment);

    this.logger.log(
      `PaymentIntent '${stripeIntentId}' created for booking '${booking.bookingReference}'`,
    );

    return {
      clientSecret: stripeClientSecret,
      paymentId: payment.id,
    };
  }

  async handleStripeWebhook(event: {
    type: string;
    data: { object: { id: string } };
  }): Promise<void> {
    const paymentIntentId = event.data.object.id;

    if (event.type === 'payment_intent.succeeded') {
      await this.handlePaymentSuccess(paymentIntentId);
    } else if (event.type === 'payment_intent.payment_failed') {
      await this.handlePaymentFailure(paymentIntentId);
    }
  }

  private async handlePaymentSuccess(paymentIntentId: string): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentIntentId },
    });

    if (!payment) {
      this.logger.warn(
        `Webhook: no Payment record found for PaymentIntent '${paymentIntentId}'`,
      );
      return;
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      this.logger.warn(
        `Webhook: PaymentIntent '${paymentIntentId}' already marked COMPLETED — skipping`,
      );
      return;
    }

    payment.status = PaymentStatus.COMPLETED;
    await this.paymentRepository.save(payment);

    // Auto-confirm the booking — this is the ONLY path to CONFIRMED for online payments
    await this.bookingRepository.update(
      { id: payment.bookingId, status: BookingStatus.PENDING },
      { status: BookingStatus.CONFIRMED },
    );

    this.logger.log(
      `Payment '${payment.id}' completed. Booking '${payment.bookingId}' auto-confirmed.`,
    );
  }

  private async handlePaymentFailure(paymentIntentId: string): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentIntentId },
    });

    if (!payment) {
      this.logger.warn(
        `Webhook: no Payment record found for failed PaymentIntent '${paymentIntentId}'`,
      );
      return;
    }

    payment.status = PaymentStatus.FAILED;
    await this.paymentRepository.save(payment);

    this.logger.log(
      `Payment '${payment.id}' marked FAILED for PaymentIntent '${paymentIntentId}'`,
    );
  }

  async confirmCashPayment(
    dto: ConfirmCashPaymentDto,
    currentUser: AuthenticatedUser,
  ): Promise<Payment> {
    const booking = await this.bookingRepository.findOne({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException(
        `Booking with ID '${dto.bookingId}' not found`,
      );
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        `Cash payment can only be recorded for PENDING bookings. Current status: '${booking.status}'`,
      );
    }

    const syntheticIntentId = `cash_${booking.id}_${Date.now()}`;

    const payment = this.paymentRepository.create({
      bookingId: booking.id,
      userId: booking.userId,
      provider: PaymentProvider.STRIPE,
      paymentIntentId: syntheticIntentId,
      amount: booking.totalPrice,
      currency: booking.currency,
      status: PaymentStatus.COMPLETED,
    });

    await this.paymentRepository.save(payment);

    await this.bookingRepository.update(
      { id: booking.id },
      { status: BookingStatus.CONFIRMED },
    );

    this.logger.log(
      `Cash payment confirmed by admin '${currentUser.id}' for booking '${booking.bookingReference}'`,
    );

    return payment;
  }

  async findAll(
    filter: FilterPaymentDto,
    currentUser: AuthenticatedUser,
  ): Promise<{ items: Payment[]; total: number }> {
    const isAdmin = currentUser.subjectType === 'ADMIN';
    const { page, limit, getAll } = filter;
    const skip = (page - 1) * limit;

    const allowedSortFields: (keyof Payment)[] = [
      'createdAt',
      'amount',
      'status',
    ];
    const sortField = allowedSortFields.includes(filter.sortBy as keyof Payment)
      ? (filter.sortBy as keyof Payment)
      : 'createdAt';
    const sortOrder = filter.sortOrder ?? 'DESC';

    const qb = this.paymentRepository
      .createQueryBuilder('payment')
      .orderBy(`payment.${sortField}`, sortOrder);

    // Guests may only see their own payments
    if (!isAdmin) {
      qb.andWhere('payment.userId = :userId', { userId: currentUser.id });
    } else if (filter.userId) {
      qb.andWhere('payment.userId = :userId', { userId: filter.userId });
    }

    if (filter.status) {
      qb.andWhere('payment.status = :status', { status: filter.status });
    }

    if (filter.bookingId) {
      qb.andWhere('payment.bookingId = :bookingId', {
        bookingId: filter.bookingId,
      });
    }

    if (!getAll) {
      qb.skip(skip).take(limit);
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async findOne(id: string, currentUser: AuthenticatedUser): Promise<Payment> {
    const isAdmin = currentUser.subjectType === 'ADMIN';

    const payment = await this.paymentRepository.findOne({
      where: isAdmin ? { id } : { id, userId: currentUser.id },
      relations: ['booking'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID '${id}' not found`);
    }

    return payment;
  }
}
