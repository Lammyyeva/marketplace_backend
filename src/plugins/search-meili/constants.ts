export const PRODUCT_INDEX = 'products';
export const SYNC_JOB_NAME = 'meili-sync-product';
export const BATCH_SIZE = 100;

export const REDIS_KEYS = {
  TOTAL_SEARCHES: 'meili:queries:total',
  TOP_TERMS: 'meili:queries:terms',
  EMPTY_TERMS: 'meili:queries:empty',
  SYNC_FAILED: 'meili:sync:failed',
  SYNC_LAST: 'meili:sync:last',
  HEALTH_CACHE: 'meili:health:cache',
  NEEDS_INITIAL_SYNC: 'meili:needs:initial-sync',
} as const;

export const MEILI_SEARCHABLE_ATTRIBUTES = [
  // Primary display fields (first translation by TypeORM order, used for
  // showing the product name in search results without locale guessing)
  'name',
  'variantName',
  'description',
  // All-language fields — every translation is indexed so searches in any
  // locale (en/ru/tm) find the product regardless of which translation
  // happened to be loaded first by TypeORM.
  'nameTranslations',
  'variantNameTranslations',
  'descriptionTranslations',
  'slugTranslations',
  // Other searchable text
  'sku',
  'collectionNames',
  'facetValueNames',
];

export const MEILI_FILTERABLE_ATTRIBUTES = [
  'price',
  'inStock',
  'collectionIds',
  'facetValueIds',
  'enabled',
  'labelIds',
  'productId',
];

export const MEILI_SORTABLE_ATTRIBUTES = [
  'price',
  'createdAt',
  'name',
];

export const MEILI_RANKING_RULES = [
  'typo',
  'words',
  'proximity',
  'attribute',
  'sort',
  'exactness',
];
