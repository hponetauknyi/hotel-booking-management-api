import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveMMKFromCurrencies1781200485065 implements MigrationInterface {
  name = 'RemoveMMKFromCurrencies1781200485065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rate_options" ALTER COLUMN "currency" SET DEFAULT 'USD'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'USD'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ALTER COLUMN "currency" SET DEFAULT 'USD'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" ALTER COLUMN "currency" SET DEFAULT 'SGD'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "currency" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_options" ALTER COLUMN "currency" DROP DEFAULT`,
    );
  }
}
