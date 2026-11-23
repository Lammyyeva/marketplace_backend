import {MigrationInterface, QueryRunner} from "typeorm";

export class SeasonalEntities1780153564814 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "season" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "slug" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "season_translation" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "languageCode" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "id" SERIAL NOT NULL, "baseId" integer, CONSTRAINT "PK_49bf677f41aa6f2d6d354a0965c" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "season_product" ("seasonId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_81bb77aa98a1471103492f84fd2" PRIMARY KEY ("seasonId", "productId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9c4a5c0d638e9d0474e7039b36" ON "season_product" ("seasonId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_1f1320ec05deffd462cae7d619" ON "season_product" ("productId") `, undefined);
        await queryRunner.query(`ALTER TABLE "season_translation" ADD CONSTRAINT "FK_af84e6c43a35c2a6258a1e71498" FOREIGN KEY ("baseId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "season_product" ADD CONSTRAINT "FK_9c4a5c0d638e9d0474e7039b362" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "season_product" ADD CONSTRAINT "FK_1f1320ec05deffd462cae7d6196" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        // Guard against duplicate: Init migration also adds this constraint
        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UQ_like_user_variant') THEN
                    ALTER TABLE "like" ADD CONSTRAINT "UQ_like_user_variant" UNIQUE ("userId", "productVariantId");
                END IF;
            END $$;
        `);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "UQ_like_user_variant"`, undefined);
        await queryRunner.query(`ALTER TABLE "season_product" DROP CONSTRAINT "FK_1f1320ec05deffd462cae7d6196"`, undefined);
        await queryRunner.query(`ALTER TABLE "season_product" DROP CONSTRAINT "FK_9c4a5c0d638e9d0474e7039b362"`, undefined);
        await queryRunner.query(`ALTER TABLE "season_translation" DROP CONSTRAINT "FK_af84e6c43a35c2a6258a1e71498"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f1320ec05deffd462cae7d619"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c4a5c0d638e9d0474e7039b36"`, undefined);
        await queryRunner.query(`DROP TABLE "season_product"`, undefined);
        await queryRunner.query(`DROP TABLE "season_translation"`, undefined);
        await queryRunner.query(`DROP TABLE "season"`, undefined);
   }

}
