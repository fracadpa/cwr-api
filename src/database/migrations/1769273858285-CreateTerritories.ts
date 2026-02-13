import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTerritories1769273858285 implements MigrationInterface {
  name = 'CreateTerritories1769273858285';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "territories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "tisCode" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f1b6bc386e20caaaf1d250efdf3" UNIQUE ("tisCode"), CONSTRAINT "PK_5fd98f342e49509ee461d86f54f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "societies" DROP CONSTRAINT "FK_04c3617d008146f33c500917be5"`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "societies_id_seq" OWNED BY "societies"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "societies" ALTER COLUMN "id" SET DEFAULT nextval('"societies_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "societies" ADD CONSTRAINT "FK_04c3617d008146f33c500917be5" FOREIGN KEY ("cwrSocietyId") REFERENCES "societies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "societies" DROP CONSTRAINT "FK_04c3617d008146f33c500917be5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "societies" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "societies_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "societies" ADD CONSTRAINT "FK_04c3617d008146f33c500917be5" FOREIGN KEY ("cwrSocietyId") REFERENCES "societies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "territories"`);
  }
}
