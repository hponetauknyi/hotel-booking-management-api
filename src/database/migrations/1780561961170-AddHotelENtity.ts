import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHotelENtity1780561961170 implements MigrationInterface {
    name = 'AddHotelENtity1780561961170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hotels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text, "latitude" numeric(10,8) NOT NULL, "longitude" numeric(11,8) NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "postalCode" character varying NOT NULL, "checkInTime" TIME NOT NULL, "checkOutTime" TIME NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdBy" uuid NOT NULL, CONSTRAINT "PK_2bb06797684115a1ba7c705fc7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD CONSTRAINT "FK_7309815ff1a3230370d612bbff3" FOREIGN KEY ("createdBy") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP CONSTRAINT "FK_7309815ff1a3230370d612bbff3"`);
        await queryRunner.query(`DROP TABLE "hotels"`);
    }

}
