import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyToUser1764437318316 implements MigrationInterface {
  name = 'AddCompanyToUser1764437318316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "companyId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_86586021a26d1180b0968f98502"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "companyId"`);
  }
}
