import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameProductClickToSearchStats1781262694612 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        // Rename the table
        await queryRunner.query(`ALTER TABLE "product_click_log" RENAME TO "product_search_stats"`);
        // Rename the column
        await queryRunner.query(`ALTER TABLE "product_search_stats" RENAME COLUMN "clicks" TO "votes"`);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        // Revert column rename
        await queryRunner.query(`ALTER TABLE "product_search_stats" RENAME COLUMN "votes" TO "clicks"`);
        // Revert table rename
        await queryRunner.query(`ALTER TABLE "product_search_stats" RENAME TO "product_click_log"`);
   }

}
