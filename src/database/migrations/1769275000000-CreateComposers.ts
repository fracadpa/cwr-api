import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComposers1769275000000 implements MigrationInterface {
  name = 'CreateComposers1769275000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."composers_controlled_composer_enum" AS ENUM('User', 'Owned')`,
    );
    await queryRunner.query(
      `CREATE TABLE "composers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "controlled_composer" "public"."composers_controlled_composer_enum" NOT NULL, "ipi_composer" character varying, "composer_alias" character varying, "ip_capacity_id" integer, "company_id" integer, "tenant_id" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_composers_code" UNIQUE ("code"), CONSTRAINT "PK_composers_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "composers" ADD CONSTRAINT "FK_composers_ip_capacity" FOREIGN KEY ("ip_capacity_id") REFERENCES "ip_capacities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "composers" ADD CONSTRAINT "FK_composers_company" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "composers" ADD CONSTRAINT "FK_composers_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "composers" DROP CONSTRAINT "FK_composers_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "composers" DROP CONSTRAINT "FK_composers_company"`,
    );
    await queryRunner.query(
      `ALTER TABLE "composers" DROP CONSTRAINT "FK_composers_ip_capacity"`,
    );
    await queryRunner.query(`DROP TABLE "composers"`);
    await queryRunner.query(
      `DROP TYPE "public"."composers_controlled_composer_enum"`,
    );
  }
}
