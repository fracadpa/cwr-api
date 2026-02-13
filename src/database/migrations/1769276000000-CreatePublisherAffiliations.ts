import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePublisherAffiliations1769276000000
  implements MigrationInterface
{
  name = 'CreatePublisherAffiliations1769276000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "publisher_affiliations" ("id" SERIAL NOT NULL, "publisher_id" integer, "public_society_id" integer, "mechanical_society_id" integer, "company_id" integer, "tenant_id" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_publisher_affiliations_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_affiliations" ADD CONSTRAINT "FK_publisher_affiliations_publisher" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_affiliations" ADD CONSTRAINT "FK_publisher_affiliations_public_society" FOREIGN KEY ("public_society_id") REFERENCES "societies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_affiliations" ADD CONSTRAINT "FK_publisher_affiliations_mechanical_society" FOREIGN KEY ("mechanical_society_id") REFERENCES "societies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_affiliations" ADD CONSTRAINT "FK_publisher_affiliations_company" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_affiliations" ADD CONSTRAINT "FK_publisher_affiliations_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "publisher_affiliations" DROP CONSTRAINT "FK_publisher_affiliations_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_affiliations" DROP CONSTRAINT "FK_publisher_affiliations_company"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_affiliations" DROP CONSTRAINT "FK_publisher_affiliations_mechanical_society"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_affiliations" DROP CONSTRAINT "FK_publisher_affiliations_public_society"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_affiliations" DROP CONSTRAINT "FK_publisher_affiliations_publisher"`,
    );
    await queryRunner.query(`DROP TABLE "publisher_affiliations"`);
  }
}
