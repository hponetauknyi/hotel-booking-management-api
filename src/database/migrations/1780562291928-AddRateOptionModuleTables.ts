import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRateOptionModuleTables1780562291928 implements MigrationInterface {
  name = 'AddRateOptionModuleTables1780562291928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "benefits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text, CONSTRAINT "PK_f83fd5765028f20487943258b46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rate_option_benefits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rateOptionId" uuid NOT NULL, "benefitId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ff9540d9d636577b058b4cb1e04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2a0ce378f98d641f92cec16fee" ON "rate_option_benefits" ("rateOptionId", "benefitId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rate_options_currency_enum" AS ENUM('USD', 'EUR', 'GBP', 'SGD', 'THB')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rate_options_cancellationpolicy_enum" AS ENUM('FREE_CANCELLATION', 'FREE_CANCELLATION_UNTIL_DEADLINE', 'NON_REFUNDABLE', 'PARTIAL_REFUND_WITHIN_WINDOW', 'FEE_BASED_CANCELLATION')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rate_options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "roomTypeId" uuid NOT NULL, "name" character varying NOT NULL, "description" text, "pricePerNight" numeric(12,2) NOT NULL, "currency" "public"."rate_options_currency_enum" NOT NULL, "isRefundable" boolean NOT NULL DEFAULT false, "cancellationPolicy" "public"."rate_options_cancellationpolicy_enum" NOT NULL, "deadlineHours" integer, CONSTRAINT "PK_c3c0190585f8e19928e76dd6121" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_option_benefits" ADD CONSTRAINT "FK_adef30a04dc252230c20568d64b" FOREIGN KEY ("rateOptionId") REFERENCES "rate_options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_option_benefits" ADD CONSTRAINT "FK_8041f989f181378a4b4355fa78e" FOREIGN KEY ("benefitId") REFERENCES "benefits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_options" ADD CONSTRAINT "FK_ce07861c7c196607058409d592d" FOREIGN KEY ("roomTypeId") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rate_options" DROP CONSTRAINT "FK_ce07861c7c196607058409d592d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_option_benefits" DROP CONSTRAINT "FK_8041f989f181378a4b4355fa78e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_option_benefits" DROP CONSTRAINT "FK_adef30a04dc252230c20568d64b"`,
    );
    await queryRunner.query(`DROP TABLE "rate_options"`);
    await queryRunner.query(
      `DROP TYPE "public"."rate_options_cancellationpolicy_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."rate_options_currency_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2a0ce378f98d641f92cec16fee"`,
    );
    await queryRunner.query(`DROP TABLE "rate_option_benefits"`);
    await queryRunner.query(`DROP TABLE "benefits"`);
  }
}
