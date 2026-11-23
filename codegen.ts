import "dotenv/config";
import type { CodegenConfig } from "@graphql-codegen/cli";

const host = "localhost";
const port = process.env.PORT || "3000";

const config: CodegenConfig = {
  overwrite: true,
  config: {
    scalars: { Money: "number" },
    namingConvention: { enumValues: "keep" },
  },
  generates: {
    "./src/plugins/generated/generated-shop-types.ts": {
      schema: `http://${host}:${port}/shop-api`,
      plugins: ["typescript", "typescript-resolvers"],
    },
    "./src/plugins/generated/generated-admin-types.ts": {
      schema: `http://${host}:${port}/admin-api`,
      documents: "./src/plugins/**/*.queries.ts",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-resolvers",
        "typed-document-node",
      ],
    },
    "./docs/schema.graphql": {
      // SpectaQL üçin SDL faýly
      schema: `http://${host}:${port}/shop-api`,
      plugins: ["schema-ast"], // JSON däl, SDL format
    },
    "./docs/graphql.schema.json": {
      schema: `http://${host}:${port}/shop-api`,
      plugins: ["introspection"],
    },
  },
};

export default config;
