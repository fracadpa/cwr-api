import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComposerAffiliations1769275500000
  implements MigrationInterface
{
  name = 'CreateComposerAffiliations1769275500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "composer_affiliations" ("id" SERIAL NOT NULL, "composer_id" integer, "public_society_id" integer, "mechanical_society_id" integer, "company_id" integer, "tenant_id" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_composer_affiliations_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "composer_affiliations" ADD CONSTRAINT "FK_composer_affiliations_composer" FOREIGN KEY ("composer_id") REFERENCES "composers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "composer_affiliations" ADD CONSTRAINT "FK_composer_affiliations_public_society" FOREIGN KEY ("public_society_id") REFERENCES "societies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "composer_affiliations" ADD CONSTRAINT "FK_composer_affiliations_mechanical_society" FOREIGN KEY ("mechanical_society_id") REFERENCES "societies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "composer_affiliations" ADD CONSTRAINT "FK_composer_affiliations_company" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "composer_affiliations" ADD CONSTRAINT "FK_composer_affiliations_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "composer_affiliations" DROP CONSTRAINT "FK_composer_affiliations_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "composer_affiliations" DROP CONSTRAINT "FK_composer_affiliations_company"`,
    );
    await queryRunner.query(
      `ALTER TABLE "composer_affiliations" DROP CONSTRAINT "FK_composer_affiliations_mechanical_society"`,
    );
    await queryRunner.query(
      `ALTER TABLE "composer_affiliations" DROP CONSTRAINT "FK_composer_affiliations_public_society"`,
    );
    await queryRunner.query(
      `ALTER TABLE "composer_affiliations" DROP CONSTRAINT "FK_composer_affiliations_composer"`,
    );
    await queryRunner.query(`DROP TABLE "composer_affiliations"`);
  }
}
