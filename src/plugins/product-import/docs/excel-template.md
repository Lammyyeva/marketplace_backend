# Excel Template Reference

> Complete field-by-field documentation for the product import spreadsheet

---

## Table of Contents

- [Downloading the Template](#downloading-the-template)
- [Sheet Structure](#sheet-structure)
- [Column Reference](#column-reference)
- [Variant Examples](#variant-examples)
- [Multi-Image Examples](#multi-image-examples)
- [Category & Collection Examples](#category--collection-examples)
- [Facet Examples](#facet-examples)
- [Custom Field Examples](#custom-field-examples)
- [SEO Examples](#seo-examples)
- [Validation Rules Summary](#validation-rules-summary)
- [Common Mistakes](#common-mistakes)

---

## Downloading the Template

### From the Dashboard

1. Go to **Catalog → Import Products**
2. Click **Download Template** (top-right)
3. Save the file `product-import-template.xlsx`

### Via REST API

```bash
curl -O -J http://localhost:3000/import/template \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

The downloaded file contains:
- **Products** sheet — data entry sheet with color-coded headers and example rows
- **Instructions** sheet — field descriptions, mode explanations, naming conventions

---

## Sheet Structure

### Row Layout

| Row | Purpose |
|---|---|
| **Row 1** | Column headers (blue = required, gray = optional) |
| **Row 2** | Field descriptions / hints |
| **Row 3+** | Your product data |

> **Do not delete or reorder rows 1–2.** The parser identifies the header row by position.

### Header Color Coding

| Color | Meaning |
|---|---|
| 🔵 Blue background | Required field — import will fail without a valid value |
| ⬛ Gray background | Optional field — leave blank to use defaults |

---

## Column Reference

### Core Product Fields

#### `productName` *(Required)*

| Property | Value |
|---|---|
| **Type** | String |
| **Max Length** | 500 characters |
| **Example** | `Wireless Headphones Pro` |

The display name of the product shown on storefront and in the admin panel. Multiple rows with the same `slug` share the same product — each row creates a new variant on that product.

---

#### `slug` *(Optional — auto-generated if blank)*

| Property | Value |
|---|---|
| **Type** | String |
| **Required** | **No** — leave blank to auto-generate |
| **Format** | Lowercase letters, numbers, hyphens only |
| **Max Length** | 200 characters |
| **Example** | `wireless-headphones-pro` or _(blank)_ |

URL-friendly product identifier used in storefront URLs (e.g. `/products/wireless-headphones-pro`). Must be **globally unique** across all products. All variants belonging to the same product must share the same slug.

**Auto-generation:** When the slug cell is empty the system automatically generates a slug from the product name and SKU:

```
productName = "Apple iPhone 15 Pro Max"  +  sku = "ST1234"
→ auto slug = "apple-iphone-15-pro-max-st1234"
```

If SKU is also absent a random 4-character hex suffix is appended instead.

**Collision handling:** If the generated (or provided) slug already exists in the database, a numeric suffix is appended until unique:
```
apple-iphone-15-pro-max-st1234   (taken)
apple-iphone-15-pro-max-st1234-1 (taken)
apple-iphone-15-pro-max-st1234-2 ✓
```

**Update mode:** During an UPDATE, if the slug column is blank the existing product slug is preserved. If a new slug is explicitly provided, the product slug is updated.

**Validation:** When a slug *is* provided, only `[a-z0-9-]` characters are accepted. The system will report an error for slugs containing spaces, uppercase letters, or special characters.

**Good examples:**
```
wireless-headphones-pro
usb-c-cable-2m
samsung-galaxy-s24-ultra
```

**Bad examples:**
```
Wireless Headphones Pro   ← spaces not allowed
wireless_headphones       ← underscores not allowed
my product!               ← special characters not allowed
```

---

#### `description` *(Optional)*

| Property | Value |
|---|---|
| **Type** | String (plain text or HTML) |
| **Example** | `Premium noise-cancelling headphones with 30h battery.` |

Full product description. Supports HTML markup. Only needs to be filled on the **first row** of a product — subsequent variant rows for the same product can leave this blank (the existing description is not overwritten).

---

### Variant Fields

#### `sku` *(Required)*

| Property | Value |
|---|---|
| **Type** | String |
| **Format** | Alphanumeric, hyphens allowed |
| **Case** | Stored as UPPERCASE |
| **Example** | `ST1234`, `ST1234-BLK`, `CABLE-002` |

Stock Keeping Unit — the primary identifier for each variant. Must be **unique across all variants**. This is the key used for UPDATE and UPSERT matching. Also determines image mapping when uploading images (see [Image Mapping Guide](./image-mapping.md)).

**Examples:**
```
ST1234          ← simple SKU
ST1234-BLK      ← SKU with color suffix
CABLE-002-1M    ← SKU with variant suffix
PROD-ABC-XL     ← multi-part SKU
```

---

#### `variantName` *(Optional)*

| Property | Value |
|---|---|
| **Type** | String |
| **Example** | `Black / XL`, `Red`, `500ml` |

The variant option label shown in the storefront option selector. Leave blank for products with only a single variant — the system will use `productName` as the variant name.

**Multi-variant example:**
| productName | slug | sku | variantName |
|---|---|---|---|
| T-Shirt Classic | t-shirt-classic | TS-RED-SM | Red / Small |
| T-Shirt Classic | t-shirt-classic | TS-RED-MD | Red / Medium |
| T-Shirt Classic | t-shirt-classic | TS-BLU-SM | Blue / Small |

---

#### `price` *(Required)*

| Property | Value |
|---|---|
| **Type** | Integer |
| **Unit** | Smallest currency unit (cents, pence, etc.) |
| **Min** | 0 |
| **Example** | `19999` = $199.99 |

> **Important:** Enter price in the **smallest currency unit**. For USD, `100` = $1.00. For JPY (no decimals), `100` = ¥100.

| Display Price | Column Value |
|---|---|
| $9.99 | `999` |
| $19.99 | `1999` |
| $199.99 | `19999` |
| $1,000.00 | `100000` |
| Free | `0` |

---

#### `stock` *(Optional)*

| Property | Value |
|---|---|
| **Type** | Integer |
| **Min** | 0 |
| **Default** | `0` |
| **Example** | `50` |

Initial stock quantity on hand. Fractional values are truncated to integer. Negative values are clamped to 0.

---

### Taxonomy Fields

#### `categories` *(Optional)*

| Property | Value |
|---|---|
| **Type** | Comma-separated string |
| **Format** | Category slugs |
| **Example** | `electronics,audio-equipment` |

Comma-separated list of category slugs to associate with the product. Category slugs must already exist in the system (the import does not create categories). Unrecognized slugs are silently ignored.

```
electronics
electronics,audio
furniture,living-room,sofas
```

---

#### `collections` *(Optional)*

| Property | Value |
|---|---|
| **Type** | Comma-separated string |
| **Format** | Collection slugs |
| **Example** | `new-arrivals,bestsellers` |

Comma-separated collection slugs. Collections in Vendure use filter rules, so direct product-to-collection assignment is noted for manual review. Include slugs for reporting purposes.

---

#### `facets` *(Optional)*

| Property | Value |
|---|---|
| **Type** | Comma-separated `facet:value` pairs |
| **Format** | `facetCode:valueCode` |
| **Example** | `color:black,brand:sony,size:xl` |

Associates existing FacetValues with the product/variant. Both the facet code and value code must exist in the system. Unknown pairs are silently skipped.

**Format breakdown:**
```
color:black          ← facet code "color", value code "black"
brand:sony           ← facet code "brand", value code "sony"
material:nylon       ← facet code "material", value code "nylon"
```

**Full example:**
```
color:red,brand:apple,storage:256gb,condition:new
```

---

### Status Fields

#### `enabled` *(Optional)*

| Property | Value |
|---|---|
| **Type** | Boolean |
| **Values** | `TRUE`, `FALSE` (case-insensitive) |
| **Default** | `TRUE` |
| **Example** | `TRUE` |

Controls whether the product is visible on the storefront. Set to `FALSE` to import a product as a draft.

Accepted truthy values: `TRUE`, `true`, `1`, `yes`
Accepted falsy values: `FALSE`, `false`, `0`, `no`

---

### Asset Fields

#### `featuredAsset` *(Optional)*

| Property | Value |
|---|---|
| **Type** | String (filename) |
| **Example** | `ST1234.jpg` |

The filename of the image to use as the featured (main) product image. The image must be uploaded separately via the **Upload Images** workflow. The filename is used to match against previously uploaded assets. Alternatively, name your files after the SKU and use the bulk image upload — the mapping is automatic.

---

#### `assetNames` *(Optional)*

| Property | Value |
|---|---|
| **Type** | Comma-separated filenames |
| **Example** | `ST1234_1.jpg,ST1234_2.jpg,ST1234_3.jpg` |

Additional gallery images for the product, in display order.

---

### SEO Fields

#### `seoTitle` *(Optional)*

| Property | Value |
|---|---|
| **Type** | String |
| **Max Length** | 70 characters (recommended) |
| **Example** | `Buy Wireless Headphones | Homestore` |

Maps to the product's `customFields.metaTitle`. Appears in browser tab title and search engine results.

---

#### `seoDescription` *(Optional)*

| Property | Value |
|---|---|
| **Type** | String |
| **Max Length** | 160 characters (recommended) |
| **Example** | `Shop the best wireless noise-cancelling headphones with 30h battery life.` |

Maps to `customFields.metaDescription`. Appears in search engine result snippets.

---

### Custom Field Columns

#### `customField_*` *(Optional)*

| Property | Value |
|---|---|
| **Format** | Column header prefixed with `customField_` |
| **Example** | `customField_warranty`, `customField_brand` |

Any column prefixed with `customField_` is mapped to the product's custom fields object. The part after `customField_` becomes the key.

| Column Header | Maps To |
|---|---|
| `customField_warranty` | `product.customFields.warranty` |
| `customField_brand` | `product.customFields.brand` |
| `customField_material` | `product.customFields.material` |
| `customField_weight_kg` | `product.customFields.weight_kg` |

> **Note:** The custom field must be registered in Vendure's `customFields` configuration. Unknown custom fields are passed as-is and TypeORM will ignore unrecognized keys.

---

## Variant Examples

### Single-Variant Product

A product with only one variant. Leave `variantName` blank:

| productName | slug | sku | variantName | price | stock |
|---|---|---|---|---|---|
| USB-C Cable 2m | usb-c-cable-2m | CABLE-002 | | 1499 | 200 |

### Multi-Variant Product (Colors)

Multiple rows, same slug, different SKUs:

| productName | slug | sku | variantName | price | stock |
|---|---|---|---|---|---|
| T-Shirt Classic | t-shirt-classic | TS-BLK-SM | Black / Small | 2999 | 50 |
| T-Shirt Classic | t-shirt-classic | TS-BLK-MD | Black / Medium | 2999 | 45 |
| T-Shirt Classic | t-shirt-classic | TS-BLK-LG | Black / Large | 2999 | 30 |
| T-Shirt Classic | t-shirt-classic | TS-WHT-SM | White / Small | 2999 | 60 |
| T-Shirt Classic | t-shirt-classic | TS-WHT-MD | White / Medium | 2999 | 40 |

> **Rule:** The `productName`, `slug`, and `description` on the first row are used for the product. Subsequent rows for the same slug reuse the existing product.

### Multi-Variant Product (Sizes + Storage)

| productName | slug | sku | variantName | price | stock |
|---|---|---|---|---|---|
| Laptop Pro 15 | laptop-pro-15 | LAP-15-8GB | 8GB RAM | 89999 | 20 |
| Laptop Pro 15 | laptop-pro-15 | LAP-15-16GB | 16GB RAM | 109999 | 15 |
| Laptop Pro 15 | laptop-pro-15 | LAP-15-32GB | 32GB RAM | 149999 | 5 |

---

## Multi-Image Examples

### Single Featured Image

```
featuredAsset: ST1234.jpg
assetNames: (blank)
```

### Featured + Gallery

```
featuredAsset: ST1234.jpg
assetNames: ST1234_1.jpg,ST1234_2.jpg,ST1234_3.jpg
```

### Multiple Variants, Each with Own Images

| sku | featuredAsset | assetNames |
|---|---|---|
| TS-BLK | TS-BLK.jpg | TS-BLK_1.jpg,TS-BLK_2.jpg |
| TS-WHT | TS-WHT.jpg | TS-WHT_1.jpg |
| TS-RED | TS-RED.jpg | |

---

## Category & Collection Examples

### Single Category

```
categories: electronics
collections: new-arrivals
```

### Multiple Categories

```
categories: electronics,audio,headphones
collections: new-arrivals,bestsellers,featured
```

### Nested Category Path (using slug)

```
categories: audio-equipment
```

> Categories must already exist. The importer resolves by slug, not by name.

---

## Facet Examples

### Single Facet

```
facets: color:black
```

### Multiple Facets

```
facets: color:black,brand:sony,material:plastic,condition:new
```

### Facet with Compound Values

```
facets: brand:apple,storage:256gb,color:space-gray,chip:m3-pro
```

**Format rules:**
- Each pair: `facetCode:valueCode`
- Pairs separated by commas
- No spaces around colons or commas
- Both facet code and value code must exist in the database

---

## Custom Field Examples

### Adding Custom Fields to Template

Add columns with the `customField_` prefix to the right of the standard columns:

| ... | customField_warranty | customField_brand | customField_weight_kg | customField_origin |
|---|---|---|---|---|
| ... | 2 years | Sony | 0.25 | Japan |
| ... | 1 year | Generic | 0.05 | China |

### Full Row Example

```
productName:         Wireless Headphones Pro
slug:                wireless-headphones-pro
description:         Premium wireless headphones
sku:                 ST1234
variantName:         Black
price:               19999
stock:               50
categories:          electronics,audio
collections:         new-arrivals
facets:              color:black,brand:sony
enabled:             TRUE
featuredAsset:       ST1234.jpg
assetNames:          ST1234_1.jpg,ST1234_2.jpg
seoTitle:            Wireless Headphones Pro | Homestore
seoDescription:      Buy the best wireless headphones with 30h battery life.
customField_warranty: 2 years
customField_brand:   Sony
```

---

## SEO Examples

| Column | Example |
|---|---|
| `seoTitle` | `Buy Wireless Headphones Pro - Free Shipping | Homestore` |
| `seoDescription` | `Premium noise-cancelling wireless headphones with 30-hour battery life. Order online with free next-day delivery.` |

---

## Validation Rules Summary

| Field | Rule | Error Message |
|---|---|---|
| `productName` | Non-empty string | `productName is required` |
| `slug` | Non-empty, `[a-z0-9-]` only | `slug contains invalid characters` |
| `sku` | Non-empty string | `sku is required` |
| `price` | Number ≥ 0 | `price cannot be negative` |
| `stock` | Integer ≥ 0 | Clamped to 0 silently |
| `enabled` | `TRUE`/`FALSE` | Invalid values default to `TRUE` |
| `facets` | `code:value` format | Unknown pairs silently skipped |
| `categories` | Existing slugs | Unknown slugs silently skipped |

---

## Common Mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Uppercase in slug | Validation error on slug | Use `lowercase-with-hyphens` only |
| Price in dollars (e.g. `19.99`) | Price stored as 19 cents | Enter price in cents: `1999` |
| Different slugs for same product | Creates duplicate products | Use the same slug for all variants of one product |
| Missing SKU | Row fails with "sku is required" | Ensure every data row has a SKU |
| Spaces in facet string | Facets not matched | `color:black,brand:sony` — no spaces |
| Deleting header rows | Parser fails | Never delete rows 1 or 2 |
| Saving as `.csv` | Parser rejects file | Always save as `.xlsx` |
| Unicode in slug | Validation error | Replace special characters with hyphens |
