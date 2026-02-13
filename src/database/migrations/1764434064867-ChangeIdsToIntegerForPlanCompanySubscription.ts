import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeIdsToIntegerForPlanCompanySubscription1764434064867
  implements MigrationInterface
{
  name = 'ChangeIdsToIntegerForPlanCompanySubscription1764434064867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_6b6d0e4dc88105a4a11103dd2cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan" DROP CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3"`,
    );
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "plan" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "plan" ADD CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_afff803795dabc6df4bec8408a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "FK_a5ddaf9fecd6c95bb38bb3c52d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_e551738d8623ccafbc57a6e8e6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d"`,
    );
    await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "planId"`);
    await queryRunner.query(`ALTER TABLE "subscription" ADD "planId" integer`);
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP COLUMN "companyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD "companyId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "FK_6c76d385c23e907d4f71d5394d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20"`,
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "REL_a5ddaf9fecd6c95bb38bb3c52d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP COLUMN "activeSubscriptionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "activeSubscriptionId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "UQ_a5ddaf9fecd6c95bb38bb3c52d0" UNIQUE ("activeSubscriptionId")`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "companyId"`);
    await queryRunner.query(`ALTER TABLE "tenant" ADD "companyId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "activeSubscriptionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "activeSubscriptionId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_e551738d8623ccafbc57a6e8e6d" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_6b6d0e4dc88105a4a11103dd2cd" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "FK_a5ddaf9fecd6c95bb38bb3c52d0" FOREIGN KEY ("activeSubscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "FK_6c76d385c23e907d4f71d5394d7" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_afff803795dabc6df4bec8408a4" FOREIGN KEY ("activeSubscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_afff803795dabc6df4bec8408a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "FK_6c76d385c23e907d4f71d5394d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "FK_a5ddaf9fecd6c95bb38bb3c52d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_6b6d0e4dc88105a4a11103dd2cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_e551738d8623ccafbc57a6e8e6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "activeSubscriptionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "activeSubscriptionId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "companyId"`);
    await queryRunner.query(`ALTER TABLE "tenant" ADD "companyId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "UQ_a5ddaf9fecd6c95bb38bb3c52d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP COLUMN "activeSubscriptionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "activeSubscriptionId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "REL_a5ddaf9fecd6c95bb38bb3c52d" UNIQUE ("activeSubscriptionId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20"`,
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "FK_6c76d385c23e907d4f71d5394d7" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP COLUMN "companyId"`,
    );
    await queryRunner.query(`ALTER TABLE "subscription" ADD "companyId" uuid`);
    await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "planId"`);
    await queryRunner.query(`ALTER TABLE "subscription" ADD "planId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d"`,
    );
    await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_e551738d8623ccafbc57a6e8e6d" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "FK_a5ddaf9fecd6c95bb38bb3c52d0" FOREIGN KEY ("activeSubscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_afff803795dabc6df4bec8408a4" FOREIGN KEY ("activeSubscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan" DROP CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3"`,
    );
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan" ADD CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_6b6d0e4dc88105a4a11103dd2cd" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
