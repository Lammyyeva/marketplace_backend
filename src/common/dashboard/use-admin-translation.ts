import { useUserSettings } from "@vendure/dashboard";
import { useMemo } from "react";

/**
 * Shape every plugin's translation bundle MUST follow:
 *
 *   const translations = { en: enJson, ru: ruJson, tk: tkJson };
 *
 * Keys may be nested arbitrarily; the hook resolves dotted paths
 * (`"search-monitoring.actions.forceSync"`).
 */
export type TranslationBundle = Record<string, unknown>;
export type TranslationTree = Record<string, TranslationBundle>;

/**
 * The fallback language used when:
 *  - the current contentLanguage has no entry for the requested key
 *  - OR the bundle lacks the contentLanguage entirely (e.g. plugin only
 *    has en+tk and the admin viewer's contentLanguage is ru).
 */
const FALLBACK_LANG = "en";

/**
 * One shared hook for every custom dashboard plugin in this project.
 *
 * Replaces the prior per-plugin `useDeliveryTranslation`,
 * `useBannerTranslation`, etc. pattern. Each plugin imports this hook,
 * passes its own `{ en, ru, tk }` translation tree, and receives a
 * `t(key)` function tied to the admin's currently-selected
 * `contentLanguage` via Vendure's `useUserSettings`.
 *
 * Usage:
 *
 *   import en from "./translations/en.json";
 *   import ru from "./translations/ru.json";
 *   import tk from "./translations/tk.json";
 *   import { useAdminTranslation } from "@/common/dashboard/use-admin-translation";
 *
 *   function MyPage() {
 *     const { t, lang } = useAdminTranslation({ en, ru, tk });
 *     return <h1>{t("page.title")}</h1>;
 *   }
 *
 * Resolution rules:
 *  - The hook walks the dotted key path in the active-language bundle.
 *  - If any segment is missing, it falls back to the same path in `en`.
 *  - If the path is still missing, it returns the key string verbatim
 *    so missing translations are visible (and grep-able) in the UI
 *    instead of silently rendering an empty string.
 */
export function useAdminTranslation(translations: TranslationTree) {
  const {
    settings: { contentLanguage },
  } = useUserSettings();

  // Pre-compute the active bundle so the t() callback stays cheap.
  const activeBundle = translations[contentLanguage] ?? translations[FALLBACK_LANG] ?? {};
  const fallbackBundle = translations[FALLBACK_LANG] ?? {};

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>): string => {
      const direct = resolvePath(activeBundle, key);
      const value = direct ?? resolvePath(fallbackBundle, key) ?? key;
      return typeof value === "string" ? interpolate(value, vars) : key;
    };
  }, [activeBundle, fallbackBundle]);

  return { t, lang: contentLanguage };
}

function resolvePath(obj: TranslationBundle | unknown, key: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  const parts = key.split(".");
  let current: any = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object" || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

/**
 * Tiny `{varName}` interpolation. Keeps us free of an ICU dependency in
 * the dashboard bundle. For ICU/plural-aware strings, render them on the
 * frontend with next-intl; the admin rarely needs that level of nuance.
 */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    name in vars ? String(vars[name]) : `{${name}}`,
  );
}
