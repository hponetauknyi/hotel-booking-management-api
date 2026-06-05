import { MigrationInterface, QueryRunner } from 'typeorm';

export class SwitchBaseEntity1780629272371 implements MigrationInterface {
  name = 'SwitchBaseEntity1780629272371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_characteristics" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "benefits" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_options" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_types" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotels" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_12defdfc64d13619ae92c49a0c" ON "room_characteristics" ("deletedAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4ec1b02d4ba714188a675d7f2c" ON "benefits" ("deletedAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc273163dad68cad96ab0f3899" ON "rate_options" ("deletedAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_189b2a72e61e0fae755c268573" ON "room_types" ("deletedAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f4cc6dbbcaac9f5c7b60d49927" ON "hotels" ("deletedAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_de5c828db603a9ae9499292b63" ON "rooms" ("deletedAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(
      `DROP INDEX "public"."IDX_de5c828db603a9ae9499292b63"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f4cc6dbbcaac9f5c7b60d49927"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_189b2a72e61e0fae755c268573"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fc273163dad68cad96ab0f3899"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4ec1b02d4ba714188a675d7f2c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_12defdfc64d13619ae92c49a0c"`,
    );

    // Drop columns
    await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "room_types" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "rate_options" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "benefits" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "room_characteristics" DROP COLUMN "deletedAt"`,
    );
  }
}
