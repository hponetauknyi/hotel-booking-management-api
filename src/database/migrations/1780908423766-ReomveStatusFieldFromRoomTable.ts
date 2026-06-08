import { MigrationInterface, QueryRunner } from "typeorm";

export class ReomveStatusFieldFromRoomTable1780908423766 implements MigrationInterface {
    name = 'ReomveStatusFieldFromRoomTable1780908423766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."rooms_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."rooms_status_enum" AS ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_SERVICE')`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "status" "public"."rooms_status_enum" NOT NULL`);
    }

}
