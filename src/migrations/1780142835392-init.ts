import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1780142835392 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        // Drop old FKs only if they still exist (they are already gone in the ikea.sql dump)
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_77975723382d45b1466740d1813') THEN
                    ALTER TABLE "product" DROP CONSTRAINT "FK_77975723382d45b1466740d1813";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_e1f603ae034d531c266b8a57413') THEN
                    ALTER TABLE "banner" DROP CONSTRAINT "FK_e1f603ae034d531c266b8a57413";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_a32a11b3f4735da5aa336f8f7f9') THEN
                    ALTER TABLE "banner" DROP CONSTRAINT "FK_a32a11b3f4735da5aa336f8f7f9";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_6a6cc2453a0675d3e2cad3070c0') THEN
                    ALTER TABLE "banner" DROP CONSTRAINT "FK_6a6cc2453a0675d3e2cad3070c0";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_f7d4c170cc89aac201aac86fcee') THEN
                    ALTER TABLE "banner" DROP CONSTRAINT "FK_f7d4c170cc89aac201aac86fcee";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_8a12e4cb68bc526f8d8e59efb12') THEN
                    ALTER TABLE "category" DROP CONSTRAINT "FK_8a12e4cb68bc526f8d8e59efb12";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_1191e0f44b29cde3a642446f415') THEN
                    ALTER TABLE "label" DROP CONSTRAINT "FK_1191e0f44b29cde3a642446f415";
                END IF;
            END $$;
        `);
        // Drop old columns only if they still exist
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "customFieldsCategoryid"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "customFieldsOnsale"`);
        await queryRunner.query(`ALTER TABLE "banner" DROP COLUMN IF EXISTS "brandId"`);
        await queryRunner.query(`ALTER TABLE "banner" DROP COLUMN IF EXISTS "imageId"`);
        await queryRunner.query(`ALTER TABLE "banner" DROP COLUMN IF EXISTS "smallId"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "imageId"`);
        await queryRunner.query(`ALTER TABLE "label" DROP COLUMN IF EXISTS "imageId"`);
        // Add unique constraint only if it doesn't exist yet
        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UQ_like_user_variant') THEN
                    ALTER TABLE "like" ADD CONSTRAINT "UQ_like_user_variant" UNIQUE ("userId", "productVariantId");
                END IF;
            END $$;
        `);
        // Add banner->category FK only if it doesn't exist yet
        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_e1f603ae034d531c266b8a57413') THEN
                    ALTER TABLE "banner" ADD CONSTRAINT "FK_e1f603ae034d531c266b8a57413" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END $$;
        `);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "banner" DROP CONSTRAINT "FK_e1f603ae034d531c266b8a57413"`, undefined);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "UQ_like_user_variant"`, undefined);
        await queryRunner.query(`ALTER TABLE "label" ADD "imageId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "category" ADD "imageId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "banner" ADD "smallId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "banner" ADD "imageId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "banner" ADD "brandId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsOnsale" boolean DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsCategoryid" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "label" ADD CONSTRAINT "FK_1191e0f44b29cde3a642446f415" FOREIGN KEY ("imageId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_8a12e4cb68bc526f8d8e59efb12" FOREIGN KEY ("imageId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "banner" ADD CONSTRAINT "FK_f7d4c170cc89aac201aac86fcee" FOREIGN KEY ("brandId") REFERENCES "facet_value"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "banner" ADD CONSTRAINT "FK_6a6cc2453a0675d3e2cad3070c0" FOREIGN KEY ("imageId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "banner" ADD CONSTRAINT "FK_a32a11b3f4735da5aa336f8f7f9" FOREIGN KEY ("smallId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "banner" ADD CONSTRAINT "FK_e1f603ae034d531c266b8a57413" FOREIGN KEY ("categoryId") REFERENCES "category_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_77975723382d45b1466740d1813" FOREIGN KEY ("customFieldsCategoryid") REFERENCES "category_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

}
