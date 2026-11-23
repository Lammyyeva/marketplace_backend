# Slug Generation

> Auto-generation, collision handling, Unicode normalisation, and update rules

---

## Table of Contents

- [Overview](#overview)
- [Auto-Generation Logic](#auto-generation-logic)
- [Slug Format Rules](#slug-format-rules)
- [Collision Detection & Resolution](#collision-detection--resolution)
- [Update Behaviour](#update-behaviour)
- [Unicode Support](#unicode-support)
- [Edge Cases](#edge-cases)
- [SlugService API](#slugservice-api)

---

## Overview

The `slug` column in the import template is **optional**. When left blank the system automatically generates an SEO-safe, URL-friendly slug from the product name and SKU. This removes a common friction point for bulk imports while producing slugs that are:

- **Unique** — checked against the live database before saving
- **SEO-safe** — lowercase, ASCII-only, hyphen-separated words
- **Predictable** — derived from product name + SKU, so the same data always produces the same base slug
- **Stable on update** — existing slugs are preserved during UPDATE mode unless explicitly overridden

---

## Auto-Generation Logic

### Format

```
<name-segment>-<sku-segment>
```

| Input | Slug |
|---|---|
| `"Apple iPhone 15 Pro Max"` + `"ST1234"` | `apple-iphone-15-pro-max-st1234` |
| `"USB-C Cable 2m"` + `"CABLE-002"` | `usb-c-cable-2m-cable-002` |
| `"Wireless Headphones"` + `""` (no SKU) | `wireless-headphones-a1b2` |

### Steps

1. **Name segment**: `slugify(productName, { lower: true, strict: true, locale: 'en' })`
2. **SKU segment**: `slugify(sku.toLowerCase(), { lower: true, strict: true })` — or a 4-char random hex if SKU is empty
3. **Concatenate**: `${nameSegment}-${skuSegment}`
4. **Truncate** to 200 characters if the result exceeds the max slug length
5. **Uniqueness check**: query `product_translation.slug` in the database; append `-1`, `-2`… until unique

### Code reference

```typescript
// services/slug.service.ts
generateSlug(productName: string, sku: string): string {
    const nameSegment = this.toSlugSegment(productName);
    const skuSegment  = sku ? this.toSlugSegment(sku.toLowerCase()) : this.randomHex(4);
    return `${nameSegment}-${skuSegment}`.slice(0, MAX_SLUG_LENGTH);
}
```

---

## Slug Format Rules

When a slug *is* provided by the user, the following rules apply:

| Rule | Valid | Invalid |
|---|---|---|
| Lowercase only | `my-product` | `My-Product` |
| Letters, numbers, hyphens | `product-2024` | `product_2024`, `product.2024` |
| No leading/trailing hyphens | `product` | `-product-` |
| Max 200 characters | `short-slug` | _(200+ char string)_ |
| No spaces | `my-product` | `my product` |

Validation errors are reported as row-level `ERROR` entries in the import log and do **not** block other rows from processing.

---

## Collision Detection & Resolution

### When collisions occur

- Two rows in the same file generate the same base slug (duplicate product names with different variants)
- The product database already contains a product with the target slug

### Resolution algorithm

```
candidate = desired_slug
counter   = 1

while slugExistsInDatabase(candidate):
    candidate = `${base_slug}-${counter}`
    counter++
    if counter > 999:
        candidate = `${base_slug}-${randomHex(6)}`   # safety valve
        break

return candidate
```

### Example

```
Row 5:  productName="Widget Pro", sku="W001" → slug="widget-pro-w001"         ✓ (new)
Row 12: productName="Widget Pro", sku="W002" → slug="widget-pro-w002"         ✓ (new)
Row 19: productName="Widget Pro", sku="W001" → slug="widget-pro-w001" → taken
                                             → try "widget-pro-w001-1"        ✓
```

Collision events are logged at `WARN` level in the server log:
```
[SlugService] Slug collision detected for "widget-pro-w001" — resolved to "widget-pro-w001-1"
```

### Uniqueness scope

Uniqueness is checked across **all products in the database** (not just the current channel). This ensures slugs work in a multi-channel setup where all channels share the same product catalogue.

---

## Update Behaviour

### During UPDATE / UPSERT mode — finding existing products

Product lookup uses **SKU matching** as the primary key (via `ProductVariantService`). When a matching variant is found, the parent product is located and optionally updated.

### Slug preservation during update

| Slug column in Excel | Behaviour |
|---|---|
| **Blank** | Existing slug is **preserved** — no change to the URL |
| **Explicit value** | Slug is **updated** to the new value (after uniqueness check, excluding the current product) |

This prevents accidental slug changes — and therefore broken external links — during bulk updates.

### Example

```
Current product: id=42, slug="old-slug-st1234"

Row in UPDATE file:
  productName = "New Name"
  slug        = ""       ← blank
  sku         = "ST1234"

Result: product id=42, slug stays "old-slug-st1234"  ✅ no link breakage
```

```
Row in UPDATE file:
  productName = "New Name"
  slug        = "new-slug-st1234"   ← explicit
  sku         = "ST1234"

Result: product id=42, slug updated to "new-slug-st1234"  ✅ intentional update
```

---

## Unicode Support

The `slugify` package (with `strict: true`) handles Unicode normalisation transparently:

| Input | Output |
|---|---|
| `"Ñoño"` | `nono` |
| `"Café Crème"` | `cafe-creme` |
| `"中文产品"` | `zhong-wen-chan-pin` (transliterated) |
| `"Müller & Söhne"` | `muller-sohne` |
| `"日本語テスト"` | `ri-ben-yu-tesuto` |

> Non-Latin scripts are transliterated to their Latin phonetic equivalents where possible. If transliteration produces an empty string, the fallback `'product'` is used.

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| `productName` is blank | Slug generation uses `'product'` as the name segment; validation error still fires |
| Both `productName` and `sku` are blank | Slug = `product-<random-hex>` |
| Slug provided but all characters are stripped (e.g. `"!!!"`) | `slugify` returns `''`; system falls back to `generateSlug(productName, sku)` |
| Slug longer than 200 characters | Truncated before uniqueness check |
| 999+ collisions | Random 6-char hex suffix appended (extremely unlikely in practice) |

---

## SlugService API

```typescript
class SlugService {
    /**
     * Convert free-form text to a URL-safe slug segment.
     * "Apple iPhone 15 Pro" → "apple-iphone-15-pro"
     */
    toSlugSegment(text: string): string

    /**
     * Build the auto-generated slug for a product row.
     * productName + sku → "apple-iphone-15-pro-st1234"
     */
    generateSlug(productName: string, sku: string): string

    /**
     * Ensure slug is unique in the DB. Appends "-1", "-2"... on collision.
     * @param excludeId  Product ID to exclude from the check (for updates)
     */
    ensureUniqueSlug(ctx: RequestContext, slug: string, excludeId?: string): Promise<string>

    /**
     * Validate slug format. Returns error message or null.
     */
    validateSlugFormat(slug: string): string | null
}
```
