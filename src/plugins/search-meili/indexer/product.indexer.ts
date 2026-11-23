import { Logger } from '@nestjs/common';
import { Product } from '@vendure/core';
import { MeiliClientService } from '../meili.client';
import {
  PRODUCT_INDEX,
  BATCH_SIZE,
  MEILI_SEARCHABLE_ATTRIBUTES,
  MEILI_FILTERABLE_ATTRIBUTES,
  MEILI_SORTABLE_ATTRIBUTES,
  MEILI_RANKING_RULES,
} from '../constants';

const logger = new Logger('MeiliProductIndexer');

// Meilisearch task wait options — 120 s per batch (100 docs) is generous but safe
const TASK_TIMEOUT_MS = 120_000;
const TASK_INTERVAL_MS = 500;

// When a batch task fails (e.g. one bad doc in 100), we split it in half and
// retry. This isolates the bad document instead of aborting the entire sync.
const MIN_RETRY_BATCH_SIZE = 1;

export interface MeiliProductDocument {
  id: string;
  productId: string | number;
  // Primary display fields (one language — for showing in cards)
  name: string;
  variantName: string;
  slug: string;
  description: string;
  // All-language fields (every translation, for cross-locale search)
  nameTranslations: string[];
  variantNameTranslations: string[];
  descriptionTranslations: string[];
  slugTranslations: string[];
  asset: string;
  assetId: string;
  sku: string;
  price: number;
  priceWithTax: number;
  currencyCode: string;
  inStock: boolean;
  stockLevel: number;
  collectionIds: (string | number)[];
  collectionSlugs: string[];
  collectionNames: string[];
  facetIds: (string | number)[];
  facetValueIds: (string | number)[];
  facetNames: string[];
  facetValueNames: string[];
  labelIds: (string | number)[];
  enabled: boolean;
  createdAt: number;
}

export interface IndexingResult {
  totalDocsSent: number;
  totalDocsIndexed: number;
  failedDocIds: string[];
  productsSkipped: number;
}

/**
 * Apply index settings and WAIT for the task to complete.
 * Throws if the settings task fails — callers should catch and log.
 */
export async function applyIndexSettings(client: MeiliClientService): Promise<void> {
  const host = process.env.MEILI_HOST || 'http://localhost:7700';
  logger.log(`[MeiliIndexer] Applying settings for index "${PRODUCT_INDEX}" on ${host}...`);
  const meili = client.getClient();
  const index = meili.index(PRODUCT_INDEX);

  const task = await index.updateSettings({
    searchableAttributes: MEILI_SEARCHABLE_ATTRIBUTES,
    filterableAttributes: MEILI_FILTERABLE_ATTRIBUTES,
    sortableAttributes: MEILI_SORTABLE_ATTRIBUTES,
    rankingRules: MEILI_RANKING_RULES,
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 },
    },
    faceting: {
      maxValuesPerFacet: 200,
    },
  });

  const taskUid = (task as any).taskUid;
  logger.log(`[MeiliIndexer] Settings task ${taskUid} enqueued — waiting for completion...`);

  const completed = await meili.tasks.waitForTask(taskUid, {
    timeout: TASK_TIMEOUT_MS,
    interval: TASK_INTERVAL_MS,
  });

  if (completed.status !== 'succeeded') {
    const errMsg = (completed as any).error?.message || JSON.stringify((completed as any).error);
    throw new Error(`[MeiliIndexer] Settings task ${taskUid} FAILED: ${errMsg}`);
  }

  logger.log(`[MeiliIndexer] Settings task ${taskUid} succeeded.`);
}

/**
 * Map a single product to its variant documents. Returns [] and logs on
 * shape problems — never throws — so one malformed product doesn't take
 * the entire batch with it.
 */
export function mapProductToDocuments(product: Product): MeiliProductDocument[] {
  const docs: MeiliProductDocument[] = [];
  try {
    const allTranslations = product.translations || [];
    const translation = allTranslations[0];
    const productName = translation?.name || (product as any).name || '';
    const slug = translation?.slug || '';
    const description = translation?.description || '';
    // Collect EVERY translation so users can search in any locale.
    const nameTranslations = allTranslations
      .map((t) => t?.name)
      .filter((s): s is string => !!s);
    const descriptionTranslations = allTranslations
      .map((t) => t?.description)
      .filter((s): s is string => !!s);
    const slugTranslations = allTranslations
      .map((t) => t?.slug)
      .filter((s): s is string => !!s);
    const asset = product.featuredAsset?.preview || '';
    const assetId =
      product.featuredAsset?.id != null ? String(product.featuredAsset.id) : '';
    const labelIds: (string | number)[] =
      (product as any).customFields?.labels?.map((l: any) => l.id) || [];
    const enabled = product.enabled !== false;

    const variants = product.variants || [];
    if (variants.length === 0) {
      logger.warn(
        `[MeiliIndexer] Product ${product.id} (${productName || 'unnamed'}) ` +
        `has no variants — skipping`,
      );
      return docs;
    }

    for (const variant of variants) {
      try {
        if (variant.id == null) {
          logger.warn(
            `[MeiliIndexer] Product ${product.id} has variant with no id — skipping`,
          );
          continue;
        }

        const allVariantTranslations = variant.translations || [];
        const variantTranslation = allVariantTranslations[0];
        const variantName =
          variantTranslation?.name || (variant as any).name || productName;
        const variantNameTranslations = allVariantTranslations
          .map((t) => t?.name)
          .filter((s): s is string => !!s);

        const stockLevel =
          (variant as any).stockLevels?.reduce(
            (sum: number, sl: any) => sum + (sl.stockOnHand ?? 0),
            0,
          ) || 0;

        // Resolve price from productVariantPrices (channel-agnostic: take first available price)
        const variantPrices: any[] = (variant as any).productVariantPrices || [];
        const firstPrice = variantPrices[0];
        // Fall back to listPrice (populated when loaded through Vendure service layer)
        const price =
          firstPrice?.price ?? (variant as any).listPrice ?? (variant as any).price ?? 0;
        const currencyCode =
          firstPrice?.currencyCode ?? (variant as any).currencyCode ?? 'TMT';

        const collections = variant.collections || [];
        const collectionIds = collections.map((c: any) => c.id);
        const collectionSlugs = collections.map((c: any) => c.slug || '');
        const collectionNames = collections
          .flatMap((c: any) => [
            c.name || '',
            ...(c.translations?.map((t: any) => t.name || '') || []),
          ])
          .filter(Boolean);

        const facetValues = variant.facetValues || [];
        const facetValueIds = facetValues.map((fv: any) => fv.id);
        const facetIds = [
          ...new Set(facetValues.map((fv: any) => fv.facet?.id).filter(Boolean)),
        ];
        const facetValueNames = facetValues
          .flatMap((fv: any) => [
            fv.name || fv.code || '',
            ...(fv.translations?.map((t: any) => t.name || '') || []),
          ])
          .filter(Boolean);
        const facetNames = facetValues
          .flatMap((fv: any) => [
            fv.facet?.name || fv.facet?.code || '',
            ...(fv.facet?.translations?.map((t: any) => t.name || '') || []),
          ])
          .filter(Boolean);

        docs.push({
          id: String(variant.id),
          productId: product.id,
          name: productName,
          variantName,
          slug,
          description,
          nameTranslations,
          variantNameTranslations,
          descriptionTranslations,
          slugTranslations,
          asset,
          assetId,
          sku: variant.sku || '',
          price,
          priceWithTax: (variant as any).priceWithTax ?? price,
          currencyCode,
          inStock: stockLevel > 0,
          stockLevel,
          collectionIds,
          collectionSlugs,
          collectionNames,
          facetIds,
          facetValueIds,
          facetNames,
          facetValueNames,
          labelIds,
          enabled,
          createdAt: product.createdAt ? new Date(product.createdAt).getTime() : Date.now(),
        });
      } catch (variantErr: any) {
        logger.warn(
          `[MeiliIndexer] Failed to map variant ${variant?.id} ` +
          `(product ${product.id}): ${variantErr?.message}`,
        );
      }
    }
  } catch (productErr: any) {
    logger.error(
      `[MeiliIndexer] Failed to map product ${product?.id}: ${productErr?.message}`,
      productErr?.stack,
    );
  }

  return docs;
}

/**
 * Submit a batch of documents to Meilisearch and await the task. If the
 * task fails AND the batch is bigger than MIN_RETRY_BATCH_SIZE, split the
 * batch in half and recurse. This isolates the bad documents.
 *
 * Returns the list of document ids that COULD NOT be indexed.
 */
async function submitDocumentBatch(
  docs: MeiliProductDocument[],
  client: MeiliClientService,
  depth = 0,
): Promise<{ indexed: number; failedIds: string[] }> {
  if (docs.length === 0) return { indexed: 0, failedIds: [] };

  const meili = client.getClient();
  const index = meili.index(PRODUCT_INDEX);
  const batchLabel = `count=${docs.length}, firstId=${docs[0]?.id}, depth=${depth}`;

  let taskUid: number;
  try {
    const task = await index.addDocuments(docs, { primaryKey: 'id' });
    taskUid = (task as any).taskUid;
    logger.log(`[MeiliIndexer] Task ${taskUid} enqueued (${batchLabel}) — awaiting...`);
  } catch (err: any) {
    logger.error(
      `[MeiliIndexer] HTTP error sending batch (${batchLabel}): ${err?.message}`,
    );
    // HTTP-level failure (network, 500, etc.) — split & retry to isolate.
    return splitAndRetry(docs, client, depth);
  }

  const completed = await meili.tasks.waitForTask(taskUid, {
    timeout: TASK_TIMEOUT_MS,
    interval: TASK_INTERVAL_MS,
  });

  if (completed.status === 'succeeded') {
    const indexedCount = (completed as any).details?.indexedDocuments ?? docs.length;
    logger.log(
      `[MeiliIndexer] Task ${taskUid} OK — ${indexedCount} docs (${batchLabel}, ` +
      `${completed.duration ?? '?'})`,
    );
    return { indexed: indexedCount, failedIds: [] };
  }

  // Task failed — could be one bad doc poisoning the whole batch.
  const meiliError = (completed as any).error;
  const errDetail = meiliError
    ? `[${meiliError.code}] ${meiliError.message} (${meiliError.type})`
    : JSON.stringify(completed);
  logger.error(
    `[MeiliIndexer] Task ${taskUid} FAILED (${batchLabel}): ${errDetail}`,
  );

  if (docs.length <= MIN_RETRY_BATCH_SIZE) {
    // Single doc that won't index — log its content for triage and skip.
    logger.error(
      `[MeiliIndexer] Unindexable doc id=${docs[0]?.id} (productId=${docs[0]?.productId}): ${errDetail}`,
    );
    return { indexed: 0, failedIds: docs.map((d) => d.id) };
  }

  return splitAndRetry(docs, client, depth);
}

async function splitAndRetry(
  docs: MeiliProductDocument[],
  client: MeiliClientService,
  depth: number,
): Promise<{ indexed: number; failedIds: string[] }> {
  const mid = Math.floor(docs.length / 2);
  const first = docs.slice(0, mid);
  const second = docs.slice(mid);
  logger.warn(
    `[MeiliIndexer] Splitting failing batch of ${docs.length} into ` +
    `${first.length} + ${second.length} (depth=${depth + 1})`,
  );
  const [a, b] = await Promise.all([
    submitDocumentBatch(first, client, depth + 1),
    submitDocumentBatch(second, client, depth + 1),
  ]);
  return {
    indexed: a.indexed + b.indexed,
    failedIds: [...a.failedIds, ...b.failedIds],
  };
}

/**
 * Index a list of products into Meilisearch. Returns a per-product result
 * including counts of skipped/failed so the caller can report accurately
 * instead of silently aborting on the first error.
 */
export async function indexProducts(
  products: Product[],
  client: MeiliClientService,
): Promise<IndexingResult> {
  const allDocs: MeiliProductDocument[] = [];
  let productsSkipped = 0;

  for (const product of products) {
    const productDocs = mapProductToDocuments(product);
    if (productDocs.length === 0) productsSkipped++;
    allDocs.push(...productDocs);
  }

  if (allDocs.length === 0) {
    logger.warn(
      `[MeiliIndexer] No variant documents generated for ${products.length} products ` +
      `(${productsSkipped} skipped)`,
    );
    return {
      totalDocsSent: 0,
      totalDocsIndexed: 0,
      failedDocIds: [],
      productsSkipped,
    };
  }

  logger.log(
    `[MeiliIndexer] Sending ${allDocs.length} variant docs for ${products.length} products ` +
    `(${productsSkipped} products had no variants, index: "${PRODUCT_INDEX}")`,
  );

  let totalIndexed = 0;
  const failedDocIds: string[] = [];

  for (let i = 0; i < allDocs.length; i += BATCH_SIZE) {
    const batch = allDocs.slice(i, i + BATCH_SIZE);
    const result = await submitDocumentBatch(batch, client);
    totalIndexed += result.indexed;
    failedDocIds.push(...result.failedIds);
  }

  if (failedDocIds.length > 0) {
    logger.warn(
      `[MeiliIndexer] Batch complete with ${failedDocIds.length} failed doc(s): ` +
      failedDocIds.slice(0, 20).join(', ') +
      (failedDocIds.length > 20 ? ` (+${failedDocIds.length - 20} more)` : ''),
    );
  }

  return {
    totalDocsSent: allDocs.length,
    totalDocsIndexed: totalIndexed,
    failedDocIds,
    productsSkipped,
  };
}

/**
 * Delete specific variant documents from Meilisearch.
 * Waits for the delete task to complete.
 */
export async function deleteProductVariants(
  variantIds: (string | number)[],
  client: MeiliClientService,
): Promise<void> {
  if (variantIds.length === 0) return;

  const meili = client.getClient();
  const index = meili.index(PRODUCT_INDEX);

  const task = await index.deleteDocuments(variantIds.map(String));
  const taskUid = (task as any).taskUid;
  logger.log(
    `[MeiliIndexer] Delete task ${taskUid} enqueued for ${variantIds.length} variants — awaiting...`,
  );

  const completed = await meili.tasks.waitForTask(taskUid, {
    timeout: TASK_TIMEOUT_MS,
    interval: TASK_INTERVAL_MS,
  });

  if (completed.status !== 'succeeded') {
    const errMsg = (completed as any).error?.message || JSON.stringify((completed as any).error);
    throw new Error(`Meilisearch delete task ${taskUid} failed: ${errMsg}`);
  }

  logger.log(
    `[MeiliIndexer] Delete task ${taskUid} succeeded — ` +
    `${(completed as any).details?.deletedDocuments ?? variantIds.length} docs removed`,
  );
}
