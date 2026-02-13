import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArtwork1765331690289 implements MigrationInterface {
  name = 'CreateArtwork1765331690289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "artwork" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "artist" character varying, "year" integer, "medium" character varying, "dimensions" character varying, "price" numeric(10,2), "imageUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" integer, "tenantId" uuid, "createdById" integer, CONSTRAINT "PK_ee2e7c5ad7226179d4113a96fa8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "artwork" ADD CONSTRAINT "FK_47a0c0601c2a29dbfcdd64aea8a" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "artwork" ADD CONSTRAINT "FK_cab5a953da5a324883f55331a8e" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "artwork" ADD CONSTRAINT "FK_e8513cca069ae38eb17edc3c61d" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "artwork" DROP CONSTRAINT "FK_e8513cca069ae38eb17edc3c61d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "artwork" DROP CONSTRAINT "FK_cab5a953da5a324883f55331a8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "artwork" DROP CONSTRAINT "FK_47a0c0601c2a29dbfcdd64aea8a"`,
    );
    await queryRunner.query(`DROP TABLE "artwork"`);
  }
}
