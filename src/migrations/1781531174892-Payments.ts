import {MigrationInterface, QueryRunner} from "typeorm";

export class Payments1781531174892 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "payment_gateway" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT false, "displayOrder" integer NOT NULL DEFAULT '0', "credentials" jsonb NOT NULL, "configuration" jsonb NOT NULL DEFAULT '{}', "id" SERIAL NOT NULL, CONSTRAINT "PK_8cd60dcc29059b7a42ea42b0eda" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_23febabbf83df30cb2b27da180" ON "payment_gateway" ("code") `, undefined);
        await queryRunner.query(`CREATE TABLE "payment_transaction" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "externalTransactionId" character varying, "idempotencyKey" character varying NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', "expiresAt" TIMESTAMP, "requestPayload" jsonb, "responsePayload" jsonb, "callbackPayload" jsonb, "refundedAmount" integer NOT NULL DEFAULT '0', "id" SERIAL NOT NULL, "orderId" integer NOT NULL, "customerId" integer, "gatewayId" integer NOT NULL, CONSTRAINT "PK_82c3470854cf4642dfb0d7150cd" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_f6dc4fcb155c3da7149a35dc7f" ON "payment_transaction" ("externalTransactionId") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1a182d5d27bb1e1467c2d936b9" ON "payment_transaction" ("idempotencyKey") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_fda360b3eed99fbd47a4d08616" ON "payment_transaction" ("gatewayId", "status") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_6016e900fd479cc96fb38a0073" ON "payment_transaction" ("status") `, undefined);
        await queryRunner.query(`CREATE TABLE "payment_refund" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "amount" integer NOT NULL, "reason" character varying, "status" character varying NOT NULL DEFAULT 'Pending', "externalRefundId" character varying, "initiatedBy" character varying, "responsePayload" jsonb, "id" SERIAL NOT NULL, "paymentTransactionId" integer NOT NULL, CONSTRAINT "PK_9bcd6c17fe1fce78631fdb79633" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "payment_status_history" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "oldStatus" character varying, "newStatus" character varying NOT NULL, "source" character varying NOT NULL, "notes" character varying, "id" SERIAL NOT NULL, "paymentTransactionId" integer NOT NULL, CONSTRAINT "PK_d128a1857cf1b233d05f823d05e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9342b5538e4fe9aa33baa93e3c" ON "payment_status_history" ("paymentTransactionId") `, undefined);
        await queryRunner.query(`CREATE TABLE "payment_audit_log" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "action" character varying NOT NULL, "actor" character varying, "sourceIp" character varying, "payload" jsonb, "id" SERIAL NOT NULL, "paymentTransactionId" integer, CONSTRAINT "PK_594be531bc25f71111a0b8087d5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_abc3789b827c753a4535f59161" ON "payment_audit_log" ("paymentTransactionId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_da7c838502f540a6a148b2b96c" ON "payment_audit_log" ("action") `, undefined);
        await queryRunner.query(`CREATE TABLE "system_settings" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "onlinePaymentEnabled" boolean NOT NULL DEFAULT true, "id" SERIAL NOT NULL, CONSTRAINT "PK_82521f08790d248b2a80cc85d40" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "product_search_stats_id_seq" OWNED BY "product_search_stats"."id"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_search_stats" ALTER COLUMN "id" SET DEFAULT nextval('"product_search_stats_id_seq"')`, undefined);
        await queryRunner.query(`ALTER TABLE "product_search_stats" ALTER COLUMN "id" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_eec1bdc9c06ce2fcd67cd79082b" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_8a03750d4daf4c582f7f16c05f4" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_d1644874e2d361c4d2e3053ef07" FOREIGN KEY ("gatewayId") REFERENCES "payment_gateway"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "payment_refund" ADD CONSTRAINT "FK_13edf2ee7077c11aa5d7f72d39a" FOREIGN KEY ("paymentTransactionId") REFERENCES "payment_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "payment_status_history" ADD CONSTRAINT "FK_9342b5538e4fe9aa33baa93e3ce" FOREIGN KEY ("paymentTransactionId") REFERENCES "payment_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment_status_history" DROP CONSTRAINT "FK_9342b5538e4fe9aa33baa93e3ce"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment_refund" DROP CONSTRAINT "FK_13edf2ee7077c11aa5d7f72d39a"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_d1644874e2d361c4d2e3053ef07"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_8a03750d4daf4c582f7f16c05f4"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_eec1bdc9c06ce2fcd67cd79082b"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_search_stats" ALTER COLUMN "id" SET DEFAULT nextval('product_click_log_id_seq')`, undefined);
        await queryRunner.query(`ALTER TABLE "product_search_stats" ALTER COLUMN "id" DROP DEFAULT`, undefined);
        await queryRunner.query(`DROP SEQUENCE "product_search_stats_id_seq"`, undefined);
        await queryRunner.query(`DROP TABLE "system_settings"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_da7c838502f540a6a148b2b96c"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_abc3789b827c753a4535f59161"`, undefined);
        await queryRunner.query(`DROP TABLE "payment_audit_log"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_9342b5538e4fe9aa33baa93e3c"`, undefined);
        await queryRunner.query(`DROP TABLE "payment_status_history"`, undefined);
        await queryRunner.query(`DROP TABLE "payment_refund"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_6016e900fd479cc96fb38a0073"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_fda360b3eed99fbd47a4d08616"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_1a182d5d27bb1e1467c2d936b9"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_f6dc4fcb155c3da7149a35dc7f"`, undefined);
        await queryRunner.query(`DROP TABLE "payment_transaction"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_23febabbf83df30cb2b27da180"`, undefined);
        await queryRunner.query(`DROP TABLE "payment_gateway"`, undefined);
   }

}
