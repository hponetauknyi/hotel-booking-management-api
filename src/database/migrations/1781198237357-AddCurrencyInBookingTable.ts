import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrencyInBookingTable1781198237357 implements MigrationInterface {
  name = 'AddCurrencyInBookingTable1781198237357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bookings_currency_enum" AS ENUM('USD', 'EUR', 'GBP', 'SGD', 'THB')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "currency" "public"."bookings_currency_enum" NOT NULL DEFAULT 'SGD'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "currency"`);
    await queryRunner.query(`DROP TYPE "public"."bookings_currency_enum"`);
  }
}
