import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSociety1769271689932 implements MigrationInterface {
  name = 'CreateSociety1769271689932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."society_cwrver_enum" AS ENUM('v2.1', 'v2.2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "society" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "cwrSocietyId" integer, "cwrVer" "public"."society_cwrver_enum" NOT NULL, "cisacCode" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0312c19304f7b54cb0c4a39ea1f" UNIQUE ("cisacCode"), CONSTRAINT "PK_a4a918e64ee377253ae46642021" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "society" ADD CONSTRAINT "FK_cbfd1da43b8d8f35227ee1bad9e" FOREIGN KEY ("cwrSocietyId") REFERENCES "society"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "society" DROP CONSTRAINT "FK_cbfd1da43b8d8f35227ee1bad9e"`,
    );
    await queryRunner.query(`DROP TABLE "society"`);
    await queryRunner.query(`DROP TYPE "public"."society_cwrver_enum"`);
  }
}
