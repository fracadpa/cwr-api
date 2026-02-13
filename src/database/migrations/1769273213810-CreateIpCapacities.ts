import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIpCapacities1769273213810 implements MigrationInterface {
  name = 'CreateIpCapacities1769273213810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."ip_capacities_cwrcapacity_enum" AS ENUM('Acquirer', 'Adaptor', 'Administrator')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ip_capacities" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "cwrCapacity" "public"."ip_capacities_cwrcapacity_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_289d90cc81cce7a714886086e99" UNIQUE ("code"), CONSTRAINT "PK_1cd447fe4296d9c4b4fec156ace" PRIMARY KEY ("id"))`,
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
      `ALTER TABLE "societies" ALTER COLUMN "id" DROP DEFAULT`,
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
      `ALTER TABLE "societies" ALTER COLUMN "id" SET DEFAULT nextval('society_id_seq')`,
    );
    await queryRunner.query(
      `ALTER TABLE "societies" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "societies_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "societies" ADD CONSTRAINT "FK_04c3617d008146f33c500917be5" FOREIGN KEY ("cwrSocietyId") REFERENCES "societies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "ip_capacities"`);
    await queryRunner.query(
      `DROP TYPE "public"."ip_capacities_cwrcapacity_enum"`,
    );
  }
}
