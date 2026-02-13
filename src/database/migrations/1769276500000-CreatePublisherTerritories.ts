import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePublisherTerritories1769276500000
  implements MigrationInterface
{
  name = 'CreatePublisherTerritories1769276500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "publisher_territories" ("id" SERIAL NOT NULL, "publisher_affiliation_id" integer, "territory_id" integer, "company_id" integer, "tenant_id" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_publisher_territories_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_territories" ADD CONSTRAINT "FK_publisher_territories_publisher_affiliation" FOREIGN KEY ("publisher_affiliation_id") REFERENCES "publisher_affiliations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_territories" ADD CONSTRAINT "FK_publisher_territories_territory" FOREIGN KEY ("territory_id") REFERENCES "territories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_territories" ADD CONSTRAINT "FK_publisher_territories_company" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_territories" ADD CONSTRAINT "FK_publisher_territories_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "publisher_territories" DROP CONSTRAINT "FK_publisher_territories_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_territories" DROP CONSTRAINT "FK_publisher_territories_company"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_territories" DROP CONSTRAINT "FK_publisher_territories_territory"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publisher_territories" DROP CONSTRAINT "FK_publisher_territories_publisher_affiliation"`,
    );
    await queryRunner.query(`DROP TABLE "publisher_territories"`);
  }
}
