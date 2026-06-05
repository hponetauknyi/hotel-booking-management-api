import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBookingModuleTables1780562442046 implements MigrationInterface {
  name = 'CreateBookingModuleTables1780562442046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bookings_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "bookingReference" character varying NOT NULL, "userId" uuid NOT NULL, "status" "public"."bookings_status_enum" NOT NULL, "totalPrice" numeric(12,2) NOT NULL, "totalGuest" integer NOT NULL, "bookedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_efae15c3deed139b3a0ce03f69" ON "bookings" ("bookingReference") `,
    );
    await queryRunner.query(
      `CREATE TABLE "booking_rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookingId" uuid NOT NULL, "roomId" uuid NOT NULL, "rateOptionId" uuid NOT NULL, "checkInDate" date NOT NULL, "checkOutDate" date NOT NULL, "roomPricePerNight" numeric(12,2) NOT NULL, "roomTotalPrice" numeric(12,2) NOT NULL, "guestCount" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_712966000837d1e06c04ba357be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_38a69a58a323647f2e75eb994de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" ADD CONSTRAINT "FK_0306634eb14525ae6f5190af403" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" ADD CONSTRAINT "FK_a32cc760486d0f65b9a018b5f7c" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" ADD CONSTRAINT "FK_9f2850b9705e862bcf3369b5c5c" FOREIGN KEY ("rateOptionId") REFERENCES "rate_options"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" DROP CONSTRAINT "FK_9f2850b9705e862bcf3369b5c5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" DROP CONSTRAINT "FK_a32cc760486d0f65b9a018b5f7c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" DROP CONSTRAINT "FK_0306634eb14525ae6f5190af403"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_38a69a58a323647f2e75eb994de"`,
    );
    await queryRunner.query(`DROP TABLE "booking_rooms"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_efae15c3deed139b3a0ce03f69"`,
    );
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
  }
}
