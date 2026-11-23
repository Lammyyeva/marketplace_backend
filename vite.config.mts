// vite.config.ts
import { vendureDashboardPlugin } from "@vendure/dashboard/vite";
import { LanguageCode } from "@vendure/common/lib/generated-types";
import { defineConfig, type PluginOption, searchForWorkspaceRoot } from "vite";
import { pathToFileURL } from "url";
import path, { join, resolve } from "path";

// ---------------------------
// Dashboard Plugin Configuration
// ---------------------------
const dashboardPlugin = vendureDashboardPlugin({
  vendureConfigPath: pathToFileURL(
    path.resolve(__dirname, "./src/vendure-config.ts"),
  ),

  // ✅ Languages offered in the Dashboard's "Display language" selector.
  // - `tk` is a custom locale we've added — its Lingui catalog lives in
  //   src/plugins/search-meili/dashboard/i18n/tk.po and is auto-discovered
  //   by Vendure's translationsPlugin (it globs every plugin dashboard
  //   for **/*.po). Strings not yet present in tk.po fall back to the
  //   English source via Lingui's default behaviour, which is
  //   intentional and not a bug.
  // - `en` and `ru` ship as built-in .po catalogs inside @vendure/dashboard.
  // - The contentLanguage selector (a different control, used to choose
  //   which translation of catalog entities like products/categories to
  //   display) gets its options from the Vendure server's
  //   `availableLanguages` setting — see GlobalSettings in the admin.
  i18n: {
    defaultLanguage: LanguageCode.tk,
    availableLanguages: [LanguageCode.tk, LanguageCode.en, LanguageCode.ru],
  },

  theme: {
    light: {
      primary: "oklch(0.55 0.18 240)",
      "primary-foreground": "oklch(0.98 0.01 240)",
      brand: "#2563eb",
      "brand-lighter": "#93c5fd",
    },
    dark: {
      primary: "oklch(0.65 0.16 240)",
      "primary-foreground": "oklch(0.12 0.03 240)",
      brand: "#2563eb",
      "brand-lighter": "#93c5fd",
    },
  },

  // ✅ Backend API host
  // api: { host: "192.168.105.174", port: 3000 },

  // ✅ GraphQL output folder (must exist)
  gqlOutputPath: path.resolve(__dirname, "./src/gql/"),
}) as unknown as PluginOption | PluginOption[];

// ---------------------------
// Vite Config
// ---------------------------
export default defineConfig({
  base: "/dashboard/",
  root: ".",
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      "192.168.105.174",
      "homestore.yuzharyt.com",
      "api-homestore.yuzharyt.com",
    ],
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())],
    },

    cors: {
      origin: [
        "http://192.168.105.174:5173",
        "http://192.168.105.174:3000",
        "http://192.168.108.28:3000",
        "http://192.168.108.28:5173",
        "https://homestore.yuzharyt.com",
        "https://api-homestore.yuzharyt.com",
        "http://localhost:5173",
        "http://localhost:3000",
      ],
      credentials: true,
    },

    // ✅ Proxy to backend (optional, helps during dev)
    proxy: {
      "/admin-api": {
        target: "http://192.168.105.174:3000",
        changeOrigin: true,
      },
      "/shop-api": {
        target: "http://192.168.105.174:3000",
        changeOrigin: true,
      },
      "/assets": {
        target: "http://192.168.105.174:3000",
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: join(__dirname, "dist/dashboard"),
  },

  plugins: Array.isArray(dashboardPlugin) ? dashboardPlugin : [dashboardPlugin],

  resolve: {
    alias: {
      "@/gql": resolve(__dirname, "./src/gql/graphql.ts"),
      "react/jsx-runtime": resolve(
        __dirname,
        "node_modules/react/jsx-runtime.js",
      ),
      "react/jsx-dev-runtime": resolve(
        __dirname,
        "node_modules/react/jsx-dev-runtime.js",
      ),
    },
  },
});
