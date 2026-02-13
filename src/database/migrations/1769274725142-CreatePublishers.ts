import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePublishers1769274725142 implements MigrationInterface {
  name = 'CreatePublishers1769274725142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."publishers_controlledpublisher_enum" AS ENUM('User', 'Owned')`,
    );
    await queryRunner.query(
      `CREATE TABLE "publishers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "controlledPublisher" "public"."publishers_controlledpublisher_enum" NOT NULL, "ipiNumber" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ipCapacityId" integer, "companyId" integer, "tenantId" uuid, CONSTRAINT "UQ_957e026466b8e25fcada8ae1196" UNIQUE ("code"), CONSTRAINT "PK_9d73f23749dca512efc3ccbea6a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" ADD CONSTRAINT "FK_4b00cdf46370fbaf96adbf53819" FOREIGN KEY ("ipCapacityId") REFERENCES "ip_capacities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" ADD CONSTRAINT "FK_093289baff46de11e371a1fed4c" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" ADD CONSTRAINT "FK_bbe7615d14cc645449ea8a9aa61" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "publishers" DROP CONSTRAINT "FK_bbe7615d14cc645449ea8a9aa61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" DROP CONSTRAINT "FK_093289baff46de11e371a1fed4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" DROP CONSTRAINT "FK_4b00cdf46370fbaf96adbf53819"`,
    );
    await queryRunner.query(`DROP TABLE "publishers"`);
    await queryRunner.query(
      `DROP TYPE "public"."publishers_controlledpublisher_enum"`,
    );
  }
}
