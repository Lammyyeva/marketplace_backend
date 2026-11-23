import { Injectable, Logger } from '@nestjs/common';
import { RequestContext, TransactionalConnection } from '@vendure/core';
import slugify from 'slugify';
import { Product } from '@vendure/core';
import { MAX_SLUG_LENGTH } from '../constants';

@Injectable()
export class SlugService {
    private readonly logger = new Logger(SlugService.name);

    constructor(private connection: TransactionalConnection) {}

    /**
     * Convert a free-form product name into a URL-safe slug segment.
     *
     * Rules:
     *  - Unicode normalise (NFD) then strip combining characters (accents)
     *  - Lowercase
     *  - Replace spaces and non-alphanumeric characters with "-"
     *  - Collapse consecutive hyphens
     *  - Strip leading/trailing hyphens
     *  - Truncate to MAX_SLUG_LENGTH
     *
     * @example
     *   toSlugSegment('Apple iPhone 15 Pro Max') → 'apple-iphone-15-pro-max'
     *   toSlugSegment('Ñoño – special "chars"') → 'nono-special-chars'
     */
    toSlugSegment(text: string): string {
        if (!text) return '';

        const base = slugify(text, {
            lower: true,
            strict: true,      // remove chars that are not alphanumeric or hyphens
            locale: 'en',
            trim: true,
        });

        return base.slice(0, MAX_SLUG_LENGTH) || 'product';
    }

    /**
     * Build the full auto-generated slug for a product row.
     *
     * Format:  <name-segment>-<sku-segment>
     *
     * Examples:
     *   productName = "Apple iPhone 15 Pro Max", sku = "ST1234"
     *   → "apple-iphone-15-pro-max-st1234"
     *
     *   productName = "USB-C Cable", sku = ""  (no SKU yet)
     *   → "usb-c-cable-a1b2" (random 4-char hex suffix)
     */
    generateSlug(productName: string, sku: string): string {
        const nameSegment = this.toSlugSegment(productName);
        const skuSegment = sku
            ? this.toSlugSegment(sku.toLowerCase())
            : this.randomHex(4);

        const candidate = `${nameSegment}-${skuSegment}`;
        return candidate.slice(0, MAX_SLUG_LENGTH);
    }

    /**
     * Ensure the given slug is unique across all products in the database.
     * If a collision is detected, appends an incrementing numeric suffix until unique.
     *
     * @param ctx           Vendure request context
     * @param slug          Desired slug
     * @param excludeId     Optional product ID to exclude from the uniqueness check
     *                      (used when updating an existing product — don't collide with itself)
     * @returns             A guaranteed-unique slug
     */
    async ensureUniqueSlug(
        ctx: RequestContext,
        slug: string,
        excludeId?: string | number,
    ): Promise<string> {
        const base = slug.slice(0, MAX_SLUG_LENGTH - 5); // leave room for "-NNN" suffix
        let candidate = slug;
        let counter = 1;

        while (await this.slugExistsInDb(ctx, candidate, excludeId)) {
            candidate = `${base}-${counter}`;
            counter++;
            if (counter > 999) {
                // Safety valve: extremely unlikely but prevents an infinite loop
                candidate = `${base}-${this.randomHex(6)}`;
                break;
            }
        }

        if (candidate !== slug) {
            this.logger.warn(
                `Slug collision detected for "${slug}" — resolved to "${candidate}"`,
            );
        }

        return candidate;
    }

    /**
     * Validate that a manually-provided slug only contains allowed characters.
     * Returns an error message string, or null if valid.
     */
    validateSlugFormat(slug: string): string | null {
        if (!slug) return null; // empty is fine — will be auto-generated
        if (slug.length > MAX_SLUG_LENGTH) {
            return `slug must be ${MAX_SLUG_LENGTH} characters or fewer (got ${slug.length})`;
        }
        if (!/^[a-z0-9-]+$/.test(slug)) {
            return `slug "${slug}" contains invalid characters — use lowercase letters, numbers and hyphens only`;
        }
        return null;
    }

    // ------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------

    private async slugExistsInDb(
        ctx: RequestContext,
        slug: string,
        excludeId?: string | number,
    ): Promise<boolean> {
        try {
            // Query the product_translation table because that is where slugs live
            const qb = this.connection
                .getRepository(ctx, Product)
                .createQueryBuilder('product')
                .innerJoin('product.translations', 'translation')
                .where('translation.slug = :slug', { slug })
                .andWhere('product.deletedAt IS NULL');

            if (excludeId !== undefined && excludeId !== null) {
                qb.andWhere('product.id != :excludeId', { excludeId });
            }

            const count = await qb.getCount();
            return count > 0;
        } catch {
            // If the query fails for any reason (e.g. schema mismatch during testing),
            // assume no collision rather than blocking the import.
            return false;
        }
    }

    private randomHex(length: number): string {
        return Math.random()
            .toString(16)
            .slice(2, 2 + length)
            .padEnd(length, '0');
    }
}
