import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { envValidationSchema } from './common/config/env.validation';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import dataSource from './data-source';
import { HealthModule } from './health/health.module';
import { NotificationModule } from './notification/notification.module';
import { AdminModule } from './v1/admin/admin.module';
import { AuthModule } from './v1/auth/auth.module';
import { JwtAuthGuard } from './v1/auth/guards/jwt-auth.guard';
import { BookingModule } from './v1/booking/booking.module';
import { HotelModule } from './v1/hotel/hotel.module';
import { ActivityLogModule } from './v1/log/activity-log.module';
import { ActivityLogInterceptor } from './v1/log/interceptors/activity-log.interceptor';
import { PaymentModule } from './v1/payment/payment.module';
import { RateOptionModule } from './v1/rate-option/rate-option.module';
import { RoomModule } from './v1/room/room.module';
import { SettingModule } from './v1/setting/setting.module';
import { StripeModule } from './v1/stripe/stripe.module';
import { UserModule } from './v1/user/user.module';

@Module({
  imports: [
    CommonModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    NotificationModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false,
        convert: true,
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        socket: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
        ttl: 600 * 1000,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({
      ...dataSource.options,
    }),
    AuthModule,
    ActivityLogModule,
    UserModule,
    AdminModule,
    SettingModule,
    HealthModule,
    HotelModule,
    BookingModule,
    RoomModule,
    RateOptionModule,
    PaymentModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLogInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*path');
  }
}
