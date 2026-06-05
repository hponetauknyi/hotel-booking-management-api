import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoomModuleTables1780562155320 implements MigrationInterface {
  name = 'AddRoomModuleTables1780562155320';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "room_characteristics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text, CONSTRAINT "PK_0d569bfa8bd8006dd7e030521f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room_type_characteristics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roomTypeId" uuid NOT NULL, "roomCharacteristicId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b45bf43f665e4ad2ee7750ef18f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7b87ece01b71d42bc5d8146277" ON "room_type_characteristics" ("roomTypeId", "roomCharacteristicId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "room_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "hotelId" uuid NOT NULL, "name" character varying NOT NULL, "description" text, "maxOccupancy" integer NOT NULL, "bedType" character varying NOT NULL, "areaInSquareFeet" numeric(10,2) NOT NULL, CONSTRAINT "PK_b6e1d0a9b67d4b9fbff9c35ab69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rooms_status_enum" AS ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_SERVICE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "hotelId" uuid NOT NULL, "roomTypeId" uuid NOT NULL, "roomNumber" character varying NOT NULL, "floorNumber" integer NOT NULL, "status" "public"."rooms_status_enum" NOT NULL, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7f26f50e307673fc973a85399e" ON "rooms" ("hotelId", "roomNumber") `,
    );
    await queryRunner.query(
      `ALTER TABLE "room_type_characteristics" ADD CONSTRAINT "FK_f47789b013cd7d804d957bb3b86" FOREIGN KEY ("roomTypeId") REFERENCES "room_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_type_characteristics" ADD CONSTRAINT "FK_1a7a81520935dae93e850820188" FOREIGN KEY ("roomCharacteristicId") REFERENCES "room_characteristics"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_types" ADD CONSTRAINT "FK_7ed42fc166559badb3c937c400c" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_e9d4d68c8c47b7fe47b8e233f60" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_76b20e23154532d6fc4a0f0ea27" FOREIGN KEY ("roomTypeId") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_76b20e23154532d6fc4a0f0ea27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_e9d4d68c8c47b7fe47b8e233f60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_types" DROP CONSTRAINT "FK_7ed42fc166559badb3c937c400c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_type_characteristics" DROP CONSTRAINT "FK_1a7a81520935dae93e850820188"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_type_characteristics" DROP CONSTRAINT "FK_f47789b013cd7d804d957bb3b86"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7f26f50e307673fc973a85399e"`,
    );
    await queryRunner.query(`DROP TABLE "rooms"`);
    await queryRunner.query(`DROP TYPE "public"."rooms_status_enum"`);
    await queryRunner.query(`DROP TABLE "room_types"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7b87ece01b71d42bc5d8146277"`,
    );
    await queryRunner.query(`DROP TABLE "room_type_characteristics"`);
    await queryRunner.query(`DROP TABLE "room_characteristics"`);
  }
}
