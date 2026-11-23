import {
  SearchStrategy,
  RequestContext,
  ID,
  Injector,
  Logger,
} from '@vendure/core';
import { SearchInput, SearchResponse, SearchResult } from '@vendure/common/lib/generated-types';
import { MeiliClientService } from './meili.client';
import { MeiliAnalyticsService } from './services/meili-analytics.service';
import { PRODUCT_INDEX } from './constants';
import { ProductService } from '../product/services/product.service';

/**
 * MeiliSearchStrategy implements Vendure's SearchStrategy contract.
 *
 * IMPORTANT — DO NOT decorate this class with `@Injectable()` or use
 * constructor-based dependency injection. Vendure's DefaultSearchPlugin
 * stores `options.searchStrategy` directly (no `new` call) and then
 * invokes its methods as `_searchStrategy.getSearchResults(...)`.
 *
 * - If we pass a CLASS, _searchStrategy ends up being the constructor
 *   function and instance methods are unavailable → runtime error
 *   "getSearchResults is not a function".
 * - If we pass `new MeiliSearchStrategy()`, Vendure stores the instance
 *   and calls `init(injector)` during bootstrap, where we resolve our
 *   service dependencies through Vendure's Nest injector.
 *
 * This is the official Vendure pattern for custom search strategies that
 * need DI; see InjectableStrategy in @vendure/core.
 */
const loggerCtx = 'MeiliSearchStrategy';

export class MeiliSearchStrategy implements SearchStrategy {
  private clientService!: MeiliClientService;
  private analyticsService!: MeiliAnalyticsService;
  private productService!: ProductService;

  init(injector: Injector): void {
    this.clientService = injector.get(MeiliClientService);
    this.analyticsService = injector.get(MeiliAnalyticsService);
    this.productService = injector.get(ProductService);
    Logger.info('MeiliSearchStrategy initialised — search reads will route to Meilisearch.', loggerCtx);
  }

  destroy(): void {
    // Nothing to clean up; the Meili client connection lives in the
    // MeiliClientService singleton and is managed there.
  }

  async search(
    ctx: RequestContext,
    input: SearchInput,
    enabledOnly: boolean,
  ): Promise<SearchResponse> {
    const index = this.clientService.getClient().index(PRODUCT_INDEX);
    const offset = input.skip || 0;
    const limit = input.take || 25;

    const filters = this.buildFilters(input, enabledOnly);
    const sort = this.buildSort(input);

    const result = await index.search(input.term || '', {
      offset,
      limit,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: sort.length > 0 ? sort : undefined,
      facets: ['facetValueIds', 'collectionIds'],
      attributesToHighlight: ['name', 'description', 'variantName'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    });

    const totalHits = result.estimatedTotalHits ?? result.totalHits ?? 0;

    if (input.term?.trim()) {
      this.analyticsService.recordSearch(input.term, totalHits).catch(() => {});
    }

    const items: SearchResult[] = result.hits.map((hit: any) => this.mapHitToSearchResult(hit));

    // Also track which products were shown to the user in these results.
    // We deduplicate to count each product only once per search.
    if (items.length > 0) {
      const uniqueProductIds = [...new Set(items.map((i) => Number(i.productId)))];
      this.productService.recordSearchImpressions(ctx, uniqueProductIds).catch(() => {});
    }

    return {
      items,
      totalItems: totalHits,
      facetValues: [],
      collections: [],
    };
  }

  async getSearchResults(
    ctx: RequestContext,
    input: SearchInput,
    enabledOnly: boolean,
  ): Promise<SearchResult[]> {
    const response = await this.search(ctx, input, enabledOnly);
    return response.items;
  }

  async getTotalCount(
    ctx: RequestContext,
    input: SearchInput,
    enabledOnly: boolean,
  ): Promise<number> {
    const response = await this.search(ctx, input, enabledOnly);
    return response.totalItems;
  }

  async getFacetValueIds(
    ctx: RequestContext,
    input: SearchInput,
    enabledOnly: boolean,
  ): Promise<Map<ID, number>> {
    const index = this.clientService.getClient().index(PRODUCT_INDEX);
    const filters = this.buildFilters(input, enabledOnly);

    const result = await index.search(input.term || '', {
      limit: 0,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      facets: ['facetValueIds'],
    });

    const map = new Map<ID, number>();
    const dist = result.facetDistribution?.facetValueIds || {};
    for (const [id, count] of Object.entries(dist)) {
      map.set(id as ID, count as number);
    }
    return map;
  }

  async getCollectionIds(
    ctx: RequestContext,
    input: SearchInput,
    enabledOnly: boolean,
  ): Promise<Map<ID, number>> {
    const index = this.clientService.getClient().index(PRODUCT_INDEX);
    const filters = this.buildFilters(input, enabledOnly);

    const result = await index.search(input.term || '', {
      limit: 0,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      facets: ['collectionIds'],
    });

    const map = new Map<ID, number>();
    const dist = result.facetDistribution?.collectionIds || {};
    for (const [id, count] of Object.entries(dist)) {
      map.set(id as ID, count as number);
    }
    return map;
  }

  private buildFilters(input: SearchInput, enabledOnly: boolean): string[] {
    const filters: string[] = [];

    if (enabledOnly) {
      filters.push('enabled = true');
    }

    if (input.facetValueIds && input.facetValueIds.length > 0) {
      for (const id of input.facetValueIds) {
        filters.push(`facetValueIds = ${id}`);
      }
    }

    if ((input as any).facetValueFilters?.length > 0) {
      for (const fvf of (input as any).facetValueFilters) {
        if (fvf.and) filters.push(`facetValueIds = ${fvf.and}`);
        if (fvf.or?.length > 0) {
          filters.push(`facetValueIds IN [${fvf.or.join(', ')}]`);
        }
      }
    }

    if (input.collectionId) {
      filters.push(`collectionIds = ${input.collectionId}`);
    }

    if (input.collectionSlug) {
      filters.push(`collectionSlugs = "${input.collectionSlug}"`);
    }

    if ((input as any).inStock) {
      filters.push('inStock = true');
    }

    // Custom price range fields passed via extended input
    const ext = input as any;
    if (ext.priceMin != null && ext.priceMax != null) {
      filters.push(`price >= ${ext.priceMin} AND price <= ${ext.priceMax}`);
    } else if (ext.priceMin != null) {
      filters.push(`price >= ${ext.priceMin}`);
    } else if (ext.priceMax != null) {
      filters.push(`price <= ${ext.priceMax}`);
    }

    return filters;
  }

  private buildSort(input: SearchInput): string[] {
    const sort = input.sort as any;
    if (!sort) return [];

    const sortParts: string[] = [];

    if (sort.price === 'ASC') sortParts.push('price:asc');
    else if (sort.price === 'DESC') sortParts.push('price:desc');

    if (sort.name === 'ASC') sortParts.push('name:asc');
    else if (sort.name === 'DESC') sortParts.push('name:desc');

    // Custom sort by newest
    if ((input as any).sortOrder === 'NEWEST') sortParts.push('createdAt:desc');

    return sortParts;
  }

  private mapHitToSearchResult(hit: any): SearchResult {
    const price = hit.price ?? 0;
    const priceWithTax = hit.priceWithTax ?? price;

    // SearchResultAsset.id is non-nullable in the GraphQL schema. Returning an
    // asset object without `id` makes GraphQL nullify the whole productAsset
    // (and emit "Cannot return null for non-nullable field SearchResultAsset.id"),
    // which is why search images went missing. Always provide a non-null id:
    // the real featured-asset id once the index carries it, otherwise fall back
    // to the product id so existing (not-yet-reindexed) documents still render.
    const assetId = hit.assetId
      ? String(hit.assetId)
      : String(hit.productId ?? hit.id ?? 0);
    const asset = hit.asset
      ? ({ id: assetId, preview: hit.asset } as any)
      : null;

    return {
      productId: hit.productId,
      productVariantId: hit.id,
      productName: hit.name || '',
      productVariantName: hit.variantName || hit.name || '',
      productVariantAsset: asset,
      productAsset: asset,
      sku: hit.sku || '',
      slug: hit.slug || '',
      price: { value: price } as any,
      priceWithTax: { value: priceWithTax } as any,
      currencyCode: hit.currencyCode || 'TMT',
      description: hit.description || '',
      facetIds: hit.facetIds || [],
      facetValueIds: hit.facetValueIds || [],
      collectionIds: hit.collectionIds || [],
      channelIds: hit.channelIds || [],
      enabled: hit.enabled ?? true,
      score: (hit as any)._rankingScore ?? 0,
      inStock: hit.inStock ?? false,
    } as unknown as SearchResult;
  }
}
