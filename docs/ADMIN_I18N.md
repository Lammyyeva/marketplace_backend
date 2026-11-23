# Vendure Admin Dashboard — i18n & Responsive UI Guide

This project uses the new **React-based Vendure Dashboard** (`@vendure/dashboard`, v3.6+), not the legacy Angular admin-ui. The dashboard is composed of plugin "extensions" — each plugin under `src/plugins/*/dashboard/` is a separate React tree mounted into the admin shell at well-known routes.

This document describes:

1. How translations are wired across all plugin dashboards
2. How to add a new language
3. How to migrate an existing hardcoded-English page
4. Responsive layout conventions for new pages

---

## 1. Translation architecture

### Shared hook

There is exactly **one** translation hook used by every plugin:

```ts
import { useAdminTranslation } from "@/common/dashboard/use-admin-translation";
```

(See `src/common/dashboard/use-admin-translation.ts`.)

It reads the admin viewer's currently-selected `contentLanguage` from Vendure's built-in `useUserSettings()`, picks the matching JSON bundle, and exposes a `t(key, vars?)` function:

```tsx
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import tk from "./translations/tk.json";
import { useAdminTranslation } from "@/common/dashboard/use-admin-translation";

export function MyPage() {
  const { t, lang } = useAdminTranslation({ en, ru, tk });
  return <h1>{t("my-section.title")}</h1>;
}
```

**Resolution rules:**

- Dotted keys: `"search-monitoring.actions.refresh"` walks the JSON tree.
- If the active-language bundle is missing the key → falls back to `en`.
- If `en` is also missing → returns the raw key string (so missing translations are visible AND grep-able in the UI, not silently empty).
- `{name}` placeholders are interpolated from the optional `vars` argument.

### Per-plugin layout

Every plugin's dashboard directory follows the same shape:

```
src/plugins/<name>/dashboard/
├── index.tsx                 # defineDashboardExtension({ translations, routes, ... })
├── pages/
├── components/
└── translations/
    ├── en.json               # required
    ├── ru.json               # required (Russian)
    └── tk.json               # required (Turkmen — project default content language)
```

### Two-step registration

For a translation bundle to take effect, BOTH of the following must be true:

**Step 1** — register with Vendure so it's available globally to the dashboard runtime:

```tsx
// src/plugins/<name>/dashboard/index.tsx
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import tk from "./translations/tk.json";

export default defineDashboardExtension({
  translations: { en, ru, tk },
  routes: [...],
});
```

**Step 2** — use the hook in any page/component that wants to render translated strings:

```tsx
const { t } = useAdminTranslation({ en, ru, tk });
```

Steps 1 and 2 import the same JSON files, which is intentional — Vendure's registry is used for system-level concerns (language switcher, framework-emitted messages) and the hook is used for our own page strings. Webpack/Vite deduplicates the import so there is no bundle penalty.

---

## 1.5 displayLanguage vs contentLanguage

The Vendure Dashboard distinguishes **two** independent language settings, and the i18n approach for each is different:

| Setting           | Controls                                                                 | Mechanism                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `displayLanguage` | The admin shell's own UI strings — top nav, page chrome, table headers, form labels emitted by Vendure-core React components | **Lingui** `.po` catalogs. Vendure ships `en.po`, `ru.po`, `de.po`, etc. (no `tk.po`). The build emits one `assets/i18n/<locale>.js` per `.po`, loaded dynamically at runtime. |
| `contentLanguage` | The localized values of translatable catalog entities (product names, category names, etc.) AND our own plugin pages' strings | The server's `availableLanguages` global setting controls the dropdown; our `useAdminTranslation` hook resolves plugin-page strings from `{ en, ru, tk }.json` per plugin.    |

This project's content-language flow already supported Turkmen out of the box — `vendure-config.ts` sets `defaultLanguageCode: LanguageCode.tk`, every plugin ships `tk.json`, and the shared hook picks the active `contentLanguage` automatically.

The display-language flow needed two changes:

1. **A `tk.po` Lingui catalog** somewhere the dashboard's translations plugin can find. Vendure globs `**/*.po` under every plugin's dashboard directory, so we keep ours at `src/plugins/search-meili/dashboard/i18n/tk.po` (any plugin works; we picked the one most likely to keep getting touched). The build merges this with the built-in catalogs and emits a compiled `assets/i18n/tk.js`.

2. **`tk` added to `vite.config.mts`'s `i18n.availableLanguages`**. That's the array the display-language selector reads from. Without it, even a present `tk.po` wouldn't show up in the dropdown.

After both, the selector lists `TK Türkmençe`. Selecting it activates the Lingui catalog at runtime. Strings that exist in `tk.po` render in Turkmen; strings that don't fall back to the English source text (Lingui's default), so the admin remains fully usable while translations grow in.

### Filling `tk.po` incrementally — automated sync script

We ship `scripts/translate/sync-tk-po.js` that does the mechanical heavy lifting:

```bash
node scripts/translate/sync-tk-po.js
```

What it does:

1. **Reads Vendure's bundled `en.po`** — the source-of-truth catalog with every msgid the dashboard emits (currently ~1219 entries).
2. **Reads our current `tk.po`** to preserve every non-empty `msgstr` (translator work is never lost).
3. **Applies a curated Turkmen dictionary** baked into the script for ~107 high-frequency UI words (Save, Cancel, Delete, Edit, Products, Orders, Customers, Status, etc.).
4. **Emits a fresh `tk.po`** containing every msgid in the same order Vendure emits them, with three categories of entries:
   - **Preserved**: kept exactly as the previous tk.po had them.
   - **From dictionary**: filled with the curated translation.
   - **Blank** (`msgstr ""`): falls back to the English source via Lingui.
5. **Appends plugin-only msgids** that exist only in our custom plugin source (not in Vendure's en.po) — so translations specific to our own pages are also preserved on every run.

The script prints a coverage summary:

```
[sync-tk-po] Wrote .../tk.po
  Total msgids:      1270
  Preserved (kept):  107 (incl. 0 plugin-only)
  From dictionary:   0
  Blank (fallback):  1163
  Coverage:          8.4% of Vendure core
```

Run it **after every `@vendure/dashboard` upgrade** to absorb new msgids that the upstream may have added.

### Translator workflow

1. A translator opens `src/plugins/search-meili/dashboard/i18n/tk.po` in any PO editor (Poedit, Lokalize, OmegaT) or any text editor.
2. For each entry whose `msgstr ""` is blank, they fill in the Turkmen translation.
3. They commit the file. The next run of `sync-tk-po.js` preserves every non-empty `msgstr`.

### Adding to the curated dictionary

If you find yourself manually typing the same translation in many pages (e.g., "Save" → "Ýatda sakla"), promote it into the dictionary at the top of `scripts/translate/sync-tk-po.js`. Re-run the script. The next translator run starts from a higher baseline.

### Why this approach over `lingui extract`

Vendure's dashboard build already runs Lingui extraction internally — we don't need a second extraction pipeline. The script simply reads the already-extracted `en.po` file (which Vendure ships as the source-of-truth catalog), making the workflow zero-config: no Lingui CLI install, no babel plugin setup, no extraction script in our own build. Run the script, get a complete catalog. Translator fills entries. Rebuild. Done.

### Manual editing without re-running the script

Manual edits to `tk.po` are safe — the sync script's preservation logic guarantees the next run keeps everything you wrote. You only NEED to re-run the script when:
- You upgrade `@vendure/dashboard` (new msgids may have appeared)
- You added a new entry to the dictionary
- You want to verify nothing is missing

### Why not `tr.po` (Turkish) as a substitute?

Turkish (`tr`) ships with Vendure and is ≈70% intelligible to Turkmen speakers. If you set `defaultLanguage: LanguageCode.tr` instead, you get an immediately-translated admin without writing any catalog. We've chosen `tk` here for correctness and brand identity, but `tr` is a valid fallback for pages we haven't reached yet — set the display language to `tk` and Lingui will fall back to English source; set it to `tr` and Lingui falls back to its Turkish catalog. Pick per audience.

---

## 2. How to add a new language (e.g., Uzbek `uz`)

1. **Add the locale to the language switcher**
   The dashboard's content-language switcher lists all `LanguageCode`s that Vendure recognises. Make sure your code is enabled at the server level — see `vendure-config.ts` `availableLanguages` (or accept the default which includes the full ISO 639-1 set).

2. **For each plugin, create `uz.json`**
   Copy `en.json` into `uz.json` in the same folder and translate the values. The skeletons in the existing files are intentionally small (only the strings actively used by pages) so this is cheap.

3. **Register it in `index.tsx`**
   ```ts
   import uz from "./translations/uz.json";
   export default defineDashboardExtension({
     translations: { en, ru, tk, uz },
     ...
   });
   ```
   And pass it to every `useAdminTranslation({ en, ru, tk, uz })` call in that plugin.

4. **Build + deploy**: `npm run build:server` rebuilds the dashboard bundle. No DB migration is required because translation files are static JSON shipped with the dashboard assets.

If you forget step 3 for one plugin, that plugin will silently fall back to English — the user will see English strings ONLY in those screens, which is loud-enough feedback during QA.

---

## 3. Migrating a hardcoded English page

Walk through the page top to bottom and replace each user-visible literal:

```diff
- <PageTitle>Search Monitoring</PageTitle>
+ <PageTitle>{t("search-monitoring.title")}</PageTitle>
```

```diff
- <Button>Reindex All</Button>
+ <Button>{t("search-monitoring.actions.reindexAll")}</Button>
```

For each new key, add it to **all three** JSON files (`en`, `ru`, `tk`). If a translation is unknown, leave the English text in the foreign-language bundle — the fallback resolver will use English anyway, but the entry being present in the JSON means a translator can fix it later via grep.

**Don't** translate:

- HTML element class names, route paths, GraphQL field names, asset URLs, log messages, error codes
- Strings that come straight from the GraphQL API (those are server-side; translate via Vendure's `TranslatableEntity` machinery instead)
- Identifiers used in URLs (`navMenuItem.id`, `route.path`) — these stay English-only by convention

`SearchMonitoringPage` is the reference example. Its header (`PageTitle` + 5 action buttons) is fully migrated and serves as a template for the other plugins.

---

## 4. Responsive layout conventions

The dashboard ships with Tailwind v4 (`global.css` injected via `src/dashboard-ui/global.css`). We follow these rules in every plugin page:

### 4.1 Page chrome

Use Vendure's primitives:

```tsx
<Page pageId="…">
  <PageTitle>…</PageTitle>
  <PageActionBar>
    <PageActionBarRight>
      {/* sticky toolbar buttons */}
    </PageActionBarRight>
  </PageActionBar>
  <PageLayout>
    <PageBlock column="main" blockId="…">…</PageBlock>
  </PageLayout>
</Page>
```

These adapt to mobile automatically — `PageActionBar` wraps button rows to a second line on narrow viewports.

### 4.2 Tables

Wrap every `<table>` in an overflow container so phone viewports scroll horizontally instead of breaking:

```tsx
<div className="w-full overflow-x-auto">
  <table className="w-full min-w-[640px] text-sm">…</table>
</div>
```

Use `min-w-[640px]` to set the breakpoint at which scrolling kicks in; pick a value that keeps content legible.

### 4.3 Forms

- Default to `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">` for two-column form layouts; collapses to one on mobile.
- Inputs use `w-full` and let the grid track size them.
- Validation messages: `<p className="text-xs text-rose-600 mt-1">` — always below the input, never to the side.

### 4.4 Dialogs

Use Vendure's `Dialog` primitive (shadcn under the hood) — it is already fullscreen-on-mobile, centred-on-desktop, and handles scroll containment.

### 4.5 Touch targets

Buttons inside data rows must be at least `h-8` (32 px) so they're tappable on mobile. The action-bar buttons we use (`size="sm"`) are already 32 px.

### 4.6 Status badges

Standard palette across plugins for consistency:

| State    | Tailwind classes                                                           |
| -------- | -------------------------------------------------------------------------- |
| Success  | `bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`          |
| Error    | `bg-rose-500/10 text-rose-600 border border-rose-500/20`                   |
| Warning  | `bg-amber-500/10 text-amber-600 border border-amber-500/20`                |
| Info     | `bg-cyan-500/10 text-cyan-600 border border-cyan-500/20`                   |
| Neutral  | `bg-slate-500/10 text-slate-600 border border-slate-500/20`                |

---

## 5. Checklist for a new dashboard plugin

When you add a plugin to `src/plugins/`:

- [ ] Create `dashboard/translations/{en,ru,tk}.json` with at least page titles
- [ ] `index.tsx` imports all three and passes `translations: { en, ru, tk }` to `defineDashboardExtension`
- [ ] Each page calls `const { t } = useAdminTranslation({ en, ru, tk })`
- [ ] `<PageTitle>` and all user-visible buttons/labels use `t(...)`
- [ ] Tables wrapped in `overflow-x-auto`
- [ ] Forms use responsive grid columns
- [ ] Status pills use the standard palette
- [ ] Add the new plugin's nav titles to the parent README so newcomers can find it

---

## 6. Common pitfalls

- **"My new key shows the raw `foo.bar` string"** — the bundle isn't registered in `defineDashboardExtension({ translations })`, or the key path is wrong. The fallback returns the raw key on purpose so you spot the typo.
- **"Russian content language but English text"** — the page passes only `{ en, tk }` to the hook. Add `ru` to the imports and to the hook argument.
- **"Switching language doesn't update the page"** — `useUserSettings()` updates synchronously when the admin changes `contentLanguage`; if your component memoises away from the `t` reference, lift the call into render.
- **"Server-side errors are still English"** — Vendure error messages come from the server in the request's `Accept-Language` locale. That's a Vendure config concern, not a dashboard concern; see `i18nOptions` in `vendure-config.ts`.
