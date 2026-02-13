import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSocietyToSocieties1769272251688
  implements MigrationInterface
{
  name = 'RenameSocietyToSocieties1769272251688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint before renaming
    await queryRunner.query(
      `ALTER TABLE "society" DROP CONSTRAINT IF EXISTS "FK_cbfd1da43b8d8f35227ee1bad9e"`,
    );

    // Rename the table
    await queryRunner.query(`ALTER TABLE "society" RENAME TO "societies"`);

    // Rename the enum type
    await queryRunner.query(
      `ALTER TYPE "public"."society_cwrver_enum" RENAME TO "societies_cwrver_enum"`,
    );

    // Re-add foreign key constraint with new table name
    await queryRunner.query(
      `ALTER TABLE "societies" ADD CONSTRAINT "FK_04c3617d008146f33c500917be5" FOREIGN KEY ("cwrSocietyId") REFERENCES "societies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "societies" DROP CONSTRAINT IF EXISTS "FK_04c3617d008146f33c500917be5"`,
    );

    // Rename table back
    await queryRunner.query(`ALTER TABLE "societies" RENAME TO "society"`);

    // Rename enum type back
    await queryRunner.query(
      `ALTER TYPE "public"."societies_cwrver_enum" RENAME TO "society_cwrver_enum"`,
    );

    // Re-add original foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "society" ADD CONSTRAINT "FK_cbfd1da43b8d8f35227ee1bad9e" FOREIGN KEY ("cwrSocietyId") REFERENCES "society"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
