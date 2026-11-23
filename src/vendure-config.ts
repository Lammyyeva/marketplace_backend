import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSchedulerPlugin,
  DefaultSearchPlugin,
  VendureConfig,
  RedisCachePlugin,
  LanguageCode,
  defaultPromotionActions,
  defaultPromotionConditions,
  LogLevel,
} from "@vendure/core";
import {
  defaultEmailHandlers,
  EmailPlugin,
  FileBasedTemplateLoader,
} from "@vendure/email-plugin";
import {
  AssetServerPlugin,
  configureS3AssetStorage,
} from "@vendure/asset-server-plugin";
import { DashboardPlugin } from "@vendure/dashboard/plugin";
import { GraphiqlPlugin } from "@vendure/graphiql-plugin";
import "dotenv/config";
import path from "path";
import express from "express";

import { AuthPlugin } from "./plugins/auth/auth.plugin";
import { emailVerificationHandler } from "./plugins/auth/email-handlers/email-verification.handler";
import { customFields } from "./apps/server/src/config/auth-config";
import { CategoryPlugin } from "./plugins/category/category.plugin";
import { LabelPlugin } from "./plugins/label/label.plugin";
import { BannerPlugin } from "./plugins/banner/banner.plugin";
import { ProductPlugin } from "./plugins/product/product.plugin";
import { LikePlugin } from "./plugins/like/like.plugin";
import { DeliveryPlugin } from "./plugins/delivery/delivery.plugin";
import { deliveryEligibilityChecker } from "./plugins/delivery/config/delivery-shipping-checker";
import { deliveryShippingCalculator } from "./plugins/delivery/config/delivery-shipping-calculator";
import {
  customPromotionActions,
  customPromotionConditions,
  PromotionPlugin,
} from "./plugins/promotion/promotion.plugin";
import { SearchMeiliPlugin } from "./plugins/search-meili/search-meili.plugin";
import { MeiliSearchStrategy } from "./plugins/search-meili/meili-search-strategy";
import { WorkerPlugin } from "./plugins/worker/worker.plugin";
import { ProductImportPlugin } from "./plugins/product-import/product-import.plugin";
import { SeasonalPlugin } from "./plugins/seasonal/seasonal.plugin";
import { PaymentsPlugin } from "./plugins/payments/payments.plugin";
import { DefaultLogger } from "@vendure/core";

const IS_DEV = process.env.APP_ENV === "dev";
const serverPort = +process.env.PORT || 3000;
const serverHostname = process.env.HOST || "0.0.0.0";

const minioEndpoint = process.env.MINIO_ENDPOINT || "http://localhost:9000";
const minioBucket = process.env.MINIO_BUCKET || "vendure-assets";
// MINIO_PUBLIC_URL is the externally reachable base URL of MinIO (may differ from
// internal MINIO_ENDPOINT when behind a proxy or CDN). Falls back to the endpoint.
const minioPublicUrl = (process.env.MINIO_PUBLIC_URL || minioEndpoint).replace(
  /\/$/,
  "",
);
const minioAssetUrlPrefix = `${minioPublicUrl}/${minioBucket}/`;
const shopApiPath = "shop-api";
const adminApiPath = "admin-api";

export const config: VendureConfig = {
  logger: new DefaultLogger({ level: LogLevel.Verbose }),
  shippingOptions: {
    shippingCalculators: [deliveryShippingCalculator],
    shippingEligibilityCheckers: [deliveryEligibilityChecker],
  },
  promotionOptions: {
    promotionActions: [...defaultPromotionActions, ...customPromotionActions],
    promotionConditions: [
      ...defaultPromotionConditions,
      ...customPromotionConditions,
    ],
  },
  defaultLanguageCode: LanguageCode.tk,
  apiOptions: {
    hostname: IS_DEV ? serverHostname : serverHostname,
    port: serverPort,
    adminApiPath,
    shopApiPath,
    adminApiDebug: true,
    shopApiPlayground: true,
    shopApiDebug: true,
    trustProxy: 1, // always trust one proxy hop (nginx); safe even without a proxy
    adminListQueryLimit: 10000,
    shopListQueryLimit: 10000,
    adminApiPlayground: {
      settings: {
        "request.credentials": "include",
      },
    },
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = [
          "http://localhost:5173",
          "http://localhost:3000",
          "http://homestore.yuzharyt.com",
          "http://192.168.105.174:5173",
          "http://192.168.105.174:3000",
          "https://homestore.yuzharyt.com",
          "https://api-homestore.yuzharyt.com",
          "http://192.168.108.28:3000",
          "http://192.168.108.28:5173",
          "http://192.168.107.70:5173",
          "http://192.168.107.65:3000",
          "http://192.168.107.70:5173",
          "http://192.168.107.70:3000",
          "http://192.168.107.65:5173",
          "http://192.168.107.65",
        ];

        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    },
    middleware: [
      {
        // ✅ /docs static serve
        route: "/docs",
        handler: express.static(process.cwd() + "/docs", {
          index: ["index.html"],
        }),
        beforeListen: true,
      },
    ],
    ...(IS_DEV
      ? {
          adminApiDebug: true,
          shopApiDebug: true,
        }
      : {}),
  },
  authOptions: {
    tokenMethod: ["bearer"],
    disableAuth: false,
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },

    verificationTokenDuration: "5m",
  },
  dbConnectionOptions: {
    type: "postgres",
    synchronize: false,
    migrations: [path.join(__dirname, "./migrations/*.+(js|ts)")],
    logging: false,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  customFields: customFields,
  plugins: [
    GraphiqlPlugin.init({
      route: "graphiql",
    }),
    AssetServerPlugin.init({
      route: "assets",
      // assetUploadDir is still required by AssetServerPlugin even when using S3 storage —
      // it is used as a temporary staging area during upload before the file is streamed to MinIO.
      assetUploadDir: path.join(__dirname, "../static/assets"),
      // All asset identifiers stored in the DB are bare paths (e.g. "preview/a1/img.webp").
      // assetUrlPrefix is prepended to those identifiers when building URLs for API responses,
      // so every GraphQL / REST asset field (preview, source, featuredAsset, etc.) returns a
      // full MinIO URL instead of a relative /assets/ path.
      assetUrlPrefix: minioAssetUrlPrefix,
      storageStrategyFactory: configureS3AssetStorage({
        bucket: minioBucket,
        credentials: {
          accessKeyId: process.env.MINIO_ACCESS_KEY ?? "",
          secretAccessKey: process.env.MINIO_SECRET_KEY ?? "",
        },
        nativeS3Configuration: {
          // MinIO requires forcePathStyle (virtual-hosted-style is not supported by default)
          endpoint: minioEndpoint,
          forcePathStyle: true,
          // region is required by the AWS SDK even for MinIO; the value is arbitrary
          region: "us-east-1",
        },
      }),
    }),
    DefaultSchedulerPlugin.init(),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({
      bufferUpdates: false,
      indexStockStatus: true,
      // Pass an INSTANCE, not the class. Vendure stores options.searchStrategy
      // verbatim (no `new`), so passing the class would leave _searchStrategy
      // as a constructor function and method calls would throw
      // "getSearchResults is not a function". The strategy resolves its own
      // service deps via init(injector) at bootstrap.
      searchStrategy: new MeiliSearchStrategy() as any,
    }),
    EmailPlugin.init({
      handlers: [
        ...defaultEmailHandlers.filter(
          (h) => h.type !== "email-verification" && h.type !== "password-reset",
        ),
        emailVerificationHandler,
      ],
      templateLoader: new FileBasedTemplateLoader(
        path.join(process.cwd(), "static/email/templates"),
      ),
      transport: {
        type: "smtp",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_ADDRESS,
          pass: process.env.GMAIL_PASSWORD,
        },
      },
      globalTemplateVars: {
        fromAddress: process.env.GMAIL_ADDRESS,
      },
    }),
    DashboardPlugin.init({
      route: "dashboard",
      appDir: IS_DEV
        ? path.join(__dirname, "../dist/dashboard")
        : path.join(__dirname, "dashboard"),
    }),
    RedisCachePlugin.init({
      redisOptions: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    AuthPlugin,
    CategoryPlugin.init({}),
    BannerPlugin.init({}),
    LabelPlugin,
    PromotionPlugin.init({}),
    ProductPlugin.init({}),
    LikePlugin,
    DeliveryPlugin.init({}),
    SearchMeiliPlugin,
    WorkerPlugin,
    ProductImportPlugin.init({}),
    SeasonalPlugin,
    PaymentsPlugin.init({
      encryptionKeyEnvVar: "PAYMENTS_ENCRYPTION_KEY",
      defaultExpirationMinutes: 15,
      enableMetrics: true,
    }),
  ],
};
