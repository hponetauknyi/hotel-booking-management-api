import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentTable1781161363823 implements MigrationInterface {
    name = 'CreatePaymentTable1781161363823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_provider_enum" AS ENUM('STRIPE')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_currency_enum" AS ENUM('USD', 'EUR', 'GBP', 'SGD', 'THB', 'MMK')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'REFUND_PENDING', 'REFUND_FAILED')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "bookingId" uuid NOT NULL, "userId" uuid NOT NULL, "provider" "public"."payments_provider_enum" NOT NULL, "paymentIntentId" character varying NOT NULL, "amount" numeric(12,2) NOT NULL, "currency" "public"."payments_currency_enum" NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "UQ_a1267c27d37d0c87154be17d931" UNIQUE ("paymentIntentId"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d703f4d1bf3e48dbaa5948e03d" ON "payments" ("deletedAt") `);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE INDEX "IDX_1481cb05f929015e6bbb257c25" ON "bookings" ("deletedAt") `);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_1ead3dc5d71db0ea822706e389d" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_1ead3dc5d71db0ea822706e389d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1481cb05f929015e6bbb257c25"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d703f4d1bf3e48dbaa5948e03d"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_currency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_provider_enum"`);
    }

}
