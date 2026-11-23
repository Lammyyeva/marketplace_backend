import { Injectable } from "@nestjs/common";
import {
  RequestContext,
  TransactionalConnection,
  ID,
  Product,
  Collection,
  FacetValue,
  TranslatorService,
  ProductVariantPrice,
  ListQueryBuilder,
  ListQueryOptions,
} from "@vendure/core";
import { In } from "typeorm";
import { Label } from "../../label/entities/label.entity";
import { Category } from "../../category/entities/category.entity";
import {
  AdminFilteredProductListOptions,
  FilteredProductList,
} from "../../generated/generated-admin-types";
import { ProductSearchStatEntity } from "../entities/product-search-stat.entity";
import { ActiveSaleService } from "../../promotion/services/active-sale.service";
import { MeiliAnalyticsService } from "../../search-meili/services/meili-analytics.service";
@Injectable()
export class ProductService {
  constructor(
    private connection: TransactionalConnection,
    private translator: TranslatorService,
    private listQueryBuilder: ListQueryBuilder,
    private activeSaleService: ActiveSaleService,
    private meiliAnalyticsService: MeiliAnalyticsService,
  ) { }
  async getFilteredProducts(
    ctx: RequestContext,
    args?: AdminFilteredProductListOptions,
  ): Promise<FilteredProductList> {
    const skip = args?.skip;
    const take = args?.take;
    const filter = args?.filter || {};
    const sort = args?.sort || {};
    let categoryId: number | undefined;
    let collectionId: ID | undefined;
    let modelId: ID | undefined;
    if (filter.slug && filter.type) {
      if (filter.type === "collection") {
        const collection = await this.connection
          .getRepository(ctx, Collection)
          .findOne({
            where: { translations: { slug: filter.slug } },
            select: ["id"],
          });
        if (collection) collectionId = collection.id;
        else return { items: [], totalItems: 0 };
      } else if (filter.type === "model") {
        const model = await this.connection
          .getRepository(ctx, FacetValue)
          .findOne({
            where: { code: filter.slug },
            select: ["id"],
          });
        if (model) modelId = model.id;
        else return { items: [], totalItems: 0 };
      } else if (filter.type === "category") {
        const category = await this.connection
          .getRepository(ctx, Category)
          .findOne({
            where: { slug: filter.slug },
            select: ["id"],
          });
        if (category) categoryId = Number(category.id);
        else return { items: [], totalItems: 0 };
      } else if (
        ["new", "most-searched", "recommended", "season"].includes(filter.type)
      ) {
      } else {
        const category = await this.connection
          .getRepository(ctx, Category)
          .findOne({
            where: {
              slug: filter.slug,
              categoryType: { slug: filter.type },
            },
            relations: ["categoryType"],
            select: { id: true, categoryType: { id: true, slug: true } },
          });
        if (category) categoryId = Number(category.id);
        else return { items: [], totalItems: 0 };
      }
    }
    const idQb = this.connection
      .getRepository(ctx, Product)
      .createQueryBuilder("product")
      .select("product.id", "id")
      .andWhere("product.deletedAt IS NULL");

    // Default enabled=true unless caller explicitly overrides. Public
    // listings must never surface disabled products.
    if (filter.enabled === undefined) {
      idQb.andWhere("product.enabled = true");
    } else {
      idQb.andWhere("product.enabled = :enabled", { enabled: filter.enabled });
    }

    // Default inStock=true unless caller explicitly opts in to
    // out-of-stock products (admin previews etc.). A product is
    // considered in-stock when at least one enabled, non-deleted variant
    // has a positive net stock across all stock locations.
    const stockFilter = (filter as any).inStock;
    if (stockFilter !== false) {
      idQb.andWhere(this.inStockExistsClause("product"));
    }

    if (filter.ids && filter.ids.length > 0) {
      idQb.andWhere("product.id IN (:...ids)", { ids: filter.ids });
    }
    if (filter.type === "new") {
      const newLabelId = process.env.NEW_ID;
      if (newLabelId) {
        idQb.andWhere(
          `EXISTS (
              SELECT 1 FROM product_custom_fields_labels_label pcl
              WHERE pcl."productId" = product.id AND pcl."labelId" = :newLabelId
            )`,
          { newLabelId },
        );
      }
    } else if (filter.type === "season") {
      const seasonLabelId = process.env.SEASON_ID;
      if (seasonLabelId) {
        idQb.andWhere(
          `EXISTS (
              SELECT 1 FROM product_custom_fields_labels_label pcl
              WHERE pcl."productId" = product.id AND pcl."labelId" = :seasonLabelId
            )`,
          { seasonLabelId },
        );
      }
    } else if (filter.type === "most-searched") {
      // LEFT JOIN so products with no click record still appear (sorted to the bottom).
      // ORDER BY is deferred to the sort block below so countQb doesn't inherit an
      // aggregate ORDER BY without a matching GROUP BY, which PostgreSQL rejects.
      idQb.leftJoin(ProductSearchStatEntity, "click", "click.productId = product.id");
    } else if (filter.type === "recommended") {
      idQb.andWhere("product.customFields.isRecommended = :isRecommended", {
        isRecommended: true,
      });
    }
    if (collectionId) {
      idQb
        .innerJoin(
          "product.variants",
          "ctxVariant",
          "ctxVariant.deletedAt IS NULL",
        )
        .innerJoin(
          "ctxVariant.collections",
          "ctxCollection",
          "ctxCollection.id = :collectionId",
          { collectionId },
        );
    } else if (
      categoryId &&
      (!filter.categoryIds || filter.categoryIds.length === 0)
    ) {
      idQb.innerJoin(
        "product.customFields.categories",
        "ctxCategory",
        "ctxCategory.id = :categoryId",
        { categoryId },
      );
    } else if (modelId) {
      idQb.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("1")
          .from("product_facet_values_facet_value", "pfv")
          .where("pfv.productId = product.id")
          .andWhere("pfv.facetValueId = :modelId", { modelId })
          .getQuery();
        return `EXISTS ${subQuery}`;
      });
    }
    if (filter.modelIds && filter.modelIds.length > 0) {
      idQb
        .innerJoin("product.facetValues", "modelFacetValue")
        .andWhere("modelFacetValue.id IN (:...modelIds)", {
          modelIds: filter.modelIds,
        });
    }
    if (filter.categoryIds && filter.categoryIds.length > 0) {
      const subCategoryIds = filter.categoryIds.map((id: any) => Number(id));
      idQb.innerJoin(
        "product.customFields.categories",
        "subCategoryFilter",
        "subCategoryFilter.id IN (:...subCategoryIds)",
        { subCategoryIds },
      );
    }
    if (filter.labelIds && filter.labelIds.length > 0) {
      const labelIds = filter.labelIds.map((id: any) => Number(id));
      idQb.innerJoin(
        "product.customFields.labels",
        "subLabelFilter",
        "subLabelFilter.id IN (:...labelIds)",
        { labelIds },
      );
    }
    if (filter.sku) {
      idQb
        .innerJoin("product.variants", "pv_sku")
        .andWhere("pv_sku.sku ILIKE :sku", { sku: `%${filter.sku}%` })
        .andWhere("pv_sku.deletedAt IS NULL");
    }
    if ((filter as any).isRecommended !== undefined) {
      idQb.andWhere("product.customFields.isRecommended = :isRecommended", {
        isRecommended: (filter as any).isRecommended,
      });
    }
    if (filter.isNew === true) {
      const newLabelId = process.env.NEW_ID;
      if (newLabelId) {
        idQb.andWhere(
          `EXISTS (
              SELECT 1 FROM product_custom_fields_labels_label pcl
              WHERE pcl."productId" = product.id AND pcl."labelId" = :newLabelId
            )`,
          { newLabelId },
        );
      }
    }
    if ((filter as any).isSeason === true) {
      const seasonLabelId = process.env.SEASON_ID;
      if (seasonLabelId) {
        idQb.andWhere(
          `EXISTS (
              SELECT 1 FROM product_custom_fields_labels_label pcl
              WHERE pcl."productId" = product.id AND pcl."labelId" = :seasonLabelId
            )`,
          { seasonLabelId },
        );
      }
    }
    if (filter.isSale) {
      const now = new Date();
      idQb.andWhere(
        `EXISTS (
          SELECT 1
          FROM   product_variant _pv
          WHERE  _pv."productId" = product.id
            AND  _pv."deletedAt" IS NULL
            AND  EXISTS (
              SELECT 1 FROM active_sale_lookup asl 
              WHERE asl."variantId" = _pv.id 
                AND asl."isDiscount" = true
                AND (asl."expiresAt" IS NULL OR asl."expiresAt" > :saleNow)
            )
        )`,
        { saleNow: now },
      );
    }
    // Price range filter — uses EXISTS subquery to avoid inflating row count
    if (filter.min != null || filter.max != null) {
      const priceParams: Record<string, number> = {};
      let priceSubSql = `EXISTS (
          SELECT 1
          FROM   product_variant _pv_price
          INNER  JOIN product_variant_price _pvp_price
                  ON _pvp_price."variantId" = _pv_price.id
          WHERE  _pv_price."productId" = product.id
            AND  _pv_price."deletedAt" IS NULL
      `;
      if (filter.min != null) {
        priceSubSql += `     AND _pvp_price.price >= :priceMin\n      `;
        priceParams.priceMin = Math.round((filter.min as number) * 100);
      }
      if (filter.max != null) {
        priceSubSql += `     AND _pvp_price.price <= :priceMax\n      `;
        priceParams.priceMax = Math.round((filter.max as number) * 100);
      }
      priceSubSql += ")";
      idQb.andWhere(priceSubSql, priceParams);
    }

    const countQb = idQb.clone();
    if (sort.price) {
      idQb
        .leftJoin(
          "product.variants",
          "variant_sort",
          "variant_sort.deletedAt IS NULL",
        )
        .leftJoin("variant_sort.productVariantPrices", "pvp_sort")
        .addSelect("MIN(pvp_sort.price)", "min_price")
        .groupBy("product.id")
        .orderBy("min_price", sort.price);
    } else if (sort.name) {
      idQb
        .leftJoin(
          "product.translations",
          "translation_sort",
          "translation_sort.languageCode = :lang",
          { lang: ctx.languageCode },
        )
        .groupBy("product.id")
        .addGroupBy("translation_sort.name")
        .orderBy("translation_sort.name", sort.name);
    } else if (filter.type === "most-searched") {
      // COALESCE(MAX(click.votes), 0): aggregate per GROUP BY product.id — valid PostgreSQL.
      // Products with no record get 0 and appear last.
      idQb
        .groupBy("product.id")
        .orderBy("COALESCE(MAX(click.votes), 0)", "DESC");
    } else {
      idQb.groupBy("product.id");
    }
    const [totalItems, rawIds] = await Promise.all([
      countQb.getCount(),
      idQb
        .limit(take ?? undefined)
        .offset(skip ?? undefined)
        .getRawMany<{ id: number }>(),
    ]);
    if (rawIds.length === 0) return { items: [], totalItems };
    const productIds = rawIds.map((r) => r.id);
    const products = await this.connection.getRepository(ctx, Product).find({
      where: { id: In(productIds) },
      relations: [
        "featuredAsset",
        "variants",
        "variants.productVariantPrices",
        "customFields.labels",
      ],
    });
    const productsMap = new Map(products.map((p) => [Number(p.id), p]));
    const items = await this.enrichWithSales(
      ctx,
      productIds
        .map((id) => productsMap.get(id))
        .filter(Boolean) as Product[],
    );
    return { items: items as any[], totalItems };
  }
  async getFilters(ctx: RequestContext, slug: string, type: string) {
    let collectionId: ID | undefined;
    let rootCategory: Category | undefined;
    let modelId: ID | undefined;
    if (type === "collection") {
      const collection = await this.connection
        .getRepository(ctx, Collection)
        .findOne({ where: { translations: { slug } }, select: ["id"] });
      if (!collection) return this.emptyFilters();
      collectionId = collection.id;
    } else if (type === "model") {
      const model = await this.connection
        .getRepository(ctx, FacetValue)
        .findOne({ where: { code: slug }, select: ["id"] });
      if (!model) return this.emptyFilters();
      modelId = model.id;
    } else if (type === "category") {
      const category = await this.connection
        .getRepository(ctx, Category)
        .findOne({ where: { slug } });
      if (!category) return this.emptyFilters();
      rootCategory = category;
    } else if (["new", "most-searched", "recommended"].includes(type)) {
    } else {
      const category = await this.connection
        .getRepository(ctx, Category)
        .findOne({
          where: { slug, categoryType: { slug: type } },
          relations: ["categoryType"],
        });
      if (!category) return this.emptyFilters();
      rootCategory = category;
    }
    const productQb = this.connection
      .getRepository(ctx, Product)
      .createQueryBuilder("product")
      .select("product.id")
      .andWhere("product.deletedAt IS NULL")
      .andWhere("product.enabled = true");
    if (type === "new") {
      const newLabelId = process.env.NEW_ID;
      if (newLabelId) {
        productQb.innerJoin(
          "product.customFields.labels",
          "filterNewLabel",
          "filterNewLabel.id = :newLabelId",
          { newLabelId },
        );
      }
    } else if (type === "most-searched") {
      productQb.innerJoin(
        ProductSearchStatEntity,
        "click",
        "click.productId = product.id",
      );
    } else if (type === "recommended") {
      productQb.andWhere("product.customFields.isRecommended = :isRecommended", {
        isRecommended: true,
      });
    }
    if (collectionId) {
      productQb
        .innerJoin(
          "product.variants",
          "v",
          "v.deletedAt IS NULL AND v.enabled = true",
        )
        .innerJoin("v.collections", "col", "col.id = :collectionId", {
          collectionId,
        });
    } else if (modelId) {
      productQb.innerJoin(
        "product_facet_values_facet_value",
        "mpfv",
        "mpfv.productId = product.id AND mpfv.facetValueId = :modelId",
        { modelId },
      );
    } else if (rootCategory) {
      productQb.innerJoin(
        "product.customFields.categories",
        "pcc",
        "pcc.id = :categoryId",
        { categoryId: rootCategory.id },
      );
    }
    const productIdsQuery = productQb.getQuery();
    const params = productQb.getParameters();
    const modelTask = modelId
      ? Promise.resolve([])
      : this.connection
        .getRepository(ctx, FacetValue)
        .createQueryBuilder("fv")
        .innerJoin("fv.facet", "f")
        .where("f.code = :fc", { fc: "model" })
        .innerJoin(
          "product_facet_values_facet_value",
          "pfv",
          "pfv.facetValueId = fv.id",
        )
        .andWhere(`pfv.productId IN (${productIdsQuery})`, params)
        .leftJoinAndSelect("fv.translations", "translation")
        .distinct(true)
        .getMany();
    const labelTask = this.connection
      .getRepository(ctx, Label)
      .createQueryBuilder("label")
      .innerJoin(
        "product_custom_fields_labels_label",
        "pcl",
        "pcl.labelId = label.id",
      )
      .where(`pcl.productId IN (${productIdsQuery})`, params)
      .andWhere("label.enabled = true")
      .leftJoinAndSelect("label.translations", "translation")
      .distinct(true)
      .orderBy("label.sort", "ASC")
      .getMany();
    const categoryTask = collectionId
      ?
      this.connection
        .getRepository(ctx, Category)
        .createQueryBuilder("category")
        .innerJoin(
          "product_custom_fields_categories_category",
          "pcc",
          "pcc.categoryId = category.id",
        )
        .where(`pcc.productId IN (${productIdsQuery})`, params)
        .andWhere("category.enabled = true")
        .leftJoinAndSelect("category.translations", "translation")
        .leftJoinAndSelect("category.parent", "parent")
        .distinct(true)
        .orderBy("category.sort", "ASC")
        .getMany()
      : rootCategory
        ?
        this.connection.getRepository(ctx, Category).find({
          where: { parent: { id: rootCategory.id }, enabled: true },
          relations: ["translations", "parent"],
          order: { sort: "ASC" },
        })
        :
        this.connection
          .getRepository(ctx, Category)
          .createQueryBuilder("category")
          .innerJoin(
            "product_custom_fields_categories_category",
            "pcc",
            "pcc.categoryId = category.id",
          )
          .where(`pcc.productId IN (${productIdsQuery})`, params)
          .andWhere("category.enabled = true")
          .leftJoinAndSelect("category.translations", "translation")
          .leftJoinAndSelect("category.parent", "parent")
          .distinct(true)
          .orderBy("category.sort", "ASC")
          .getMany();
    const priceTask = this.connection
      .getRepository(ctx, ProductVariantPrice)
      .createQueryBuilder("pvp")
      .select("MIN(pvp.price)", "min")
      .addSelect("MAX(pvp.price)", "max")
      .innerJoin("pvp.variant", "variant")
      .where(`variant.productId IN (${productIdsQuery})`, params)
      .andWhere("variant.deletedAt IS NULL AND variant.enabled = true")
      .getRawOne<{ min: number; max: number }>();
    const [models, labels, categories, priceStats] = await Promise.all([
      modelTask,
      labelTask,
      categoryTask,
      priceTask,
    ]);
    return {
      models,
      labels,
      categories: rootCategory
        ? (categories as Category[]).filter((c) => c.id !== rootCategory!.id)
        : categories,
      min: (priceStats?.min ?? 0) / 100,
      max: (priceStats?.max ?? 0) / 100,
    };
  }
  async getModels(ctx: RequestContext) {
    return this.connection
      .getRepository(ctx, FacetValue)
      .createQueryBuilder("fv")
      .innerJoin("fv.facet", "f")
      .where("f.code = :fc", { fc: "model" })
      .leftJoinAndSelect("fv.translations", "translation")
      .distinct(true)
      .getMany();
  }
  private emptyFilters() {
    return { models: [], labels: [], categories: [], min: 0, max: 0 };
  }
  async getHomePageData(
    ctx: RequestContext,
    options?: ListQueryOptions<Product>,
  ) {
    const take = options?.take || 10;
    const newLabelId = process.env.NEW_ID ? Number(process.env.NEW_ID) : null;
    const [newIds, mostSearchedIds, recommendedIds] = await Promise.all([
      this.fetchNewIds(ctx, take, newLabelId),
      this.fetchMostSearchedIds(ctx, take),
      this.fetchRecommendedIds(ctx, take),
    ]);
    const allIds = [...new Set([...newIds, ...mostSearchedIds, ...recommendedIds])];
    const productsMap = await this.batchLoadProducts(ctx, allIds);
    const mapSection = (ids: number[]) =>
      ids.map((id) => productsMap.get(id)).filter(Boolean) as Product[];
    const [newProducts, mostSearchedProducts, recommendedProducts] = await Promise.all([
      this.enrichWithSales(ctx, mapSection(newIds)),
      this.enrichWithSales(ctx, mapSection(mostSearchedIds)),
      this.enrichWithSales(ctx, mapSection(recommendedIds)),
    ]);
    return [
      {
        title: "Täze harytlar",
        products: newProducts as any[],
        slug: "new",
        allBtn: true,
        type: "new",
      },
      {
        title: "Iň köp gözlenenler",
        products: mostSearchedProducts as any[],
        slug: "most-searched",
        allBtn: true,
        type: "most-searched",
      },
      {
        title: "Teklip berilýänler",
        products: recommendedProducts as any[],
        slug: "recommended",
        allBtn: true,
        type: "recommended",
      },
    ];
  }
  /**
   * Shared SQL fragment that excludes products with no purchasable
   * variants. Must be `.andWhere`'d against a query whose primary
   * product alias is parameterised so the same fragment works in
   * both "product" (getFilteredProducts) and "p" (home-page helpers)
   * contexts.
   */
  private inStockExistsClause(productAlias: string): string {
    return `EXISTS (
      SELECT 1
      FROM product_variant pv
      INNER JOIN stock_level sl ON sl."productVariantId" = pv.id
      WHERE pv."productId" = ${productAlias}.id
        AND pv.enabled = true
        AND pv."deletedAt" IS NULL
      GROUP BY pv.id
      HAVING SUM(sl."stockOnHand" - sl."stockAllocated") > 0
    )`;
  }

  private async fetchNewIds(
    ctx: RequestContext,
    limit: number,
    newLabelId: number | null,
  ): Promise<number[]> {
    const qb = this.connection
      .getRepository(ctx, Product)
      .createQueryBuilder("p")
      .select("p.id", "id")
      .where("p.deletedAt IS NULL")
      .andWhere("p.enabled = true")
      .andWhere(this.inStockExistsClause("p"));
    if (newLabelId) {
      qb.andWhere(
        `EXISTS (
          SELECT 1 FROM product_custom_fields_labels_label pcl
          WHERE pcl."productId" = p.id AND pcl."labelId" = :newLabelId
        )`,
        { newLabelId },
      );
    }
    const rows = await qb
      .orderBy("p.createdAt", "DESC")
      .limit(limit)
      .getRawMany<{ id: number }>();
    return rows.map((r) => r.id);
  }
  private async fetchMostSearchedIds(
    ctx: RequestContext,
    limit: number,
  ): Promise<number[]> {
    // We now use the database (SQL) exclusively for tracking "votes" 
    // (combined clicks + search impressions).
    const rows = await this.connection
      .getRepository(ctx, Product)
      .createQueryBuilder("p")
      .select("p.id", "id")
      .innerJoin(ProductSearchStatEntity, "click", "click.productId = p.id")
      .where("p.deletedAt IS NULL")
      .andWhere("p.enabled = true")
      .andWhere(this.inStockExistsClause("p"))
      .orderBy("click.votes", "DESC")
      .limit(limit)
      .getRawMany<{ id: number }>();
    return rows.map((r) => r.id);
  }
  private async fetchRecommendedIds(
    ctx: RequestContext,
    limit: number,
  ): Promise<number[]> {
    const rows = await this.connection
      .getRepository(ctx, Product)
      .createQueryBuilder("p")
      .select("p.id", "id")
      .where("p.deletedAt IS NULL")
      .andWhere("p.enabled = true")
      .andWhere(this.inStockExistsClause("p"))
      .andWhere("p.customFields.isRecommended = :isRecommended", {
        isRecommended: true,
      })
      .orderBy("p.createdAt", "DESC")
      .limit(limit)
      .getRawMany<{ id: number }>();
    return rows.map((r) => r.id);
  }
  private async batchLoadProducts(
    ctx: RequestContext,
    productIds: number[],
  ): Promise<Map<number, Product>> {
    if (!productIds.length) return new Map();
    const products = await this.connection
      .getRepository(ctx, Product)
      .find({
        where: { id: In(productIds) },
        relations: [
          "featuredAsset",
          "variants",
          "variants.productVariantPrices",
          "customFields.labels",
        ],
      });
    return new Map(products.map((p) => [Number(p.id), p]));
  }
  async trackProductClick(ctx: RequestContext, productId: number, productName: string): Promise<void> {
    await this.connection.rawConnection.query(
      `INSERT INTO product_search_stats ("productId", "productName", "votes")
       VALUES ($1, $2, 1)
       ON CONFLICT ("productId")
       DO UPDATE SET "votes" = product_search_stats."votes" + 1,
                     "productName" = EXCLUDED."productName",
                     "updatedAt" = NOW()`,
      [productId, productName],
    );
  }

  /**
   * Records search impressions ("votes") in the database.
   * This combines search appearances with clicks into a single popularity score.
   */
  async recordSearchImpressions(ctx: RequestContext, productIds: number[]): Promise<void> {
    if (!productIds.length) return;

    // Perform a batch update/insert. Using raw SQL for efficiency with ON CONFLICT.
    // We only update 'votes' (formely clicks) and updatedAt.
    try {
      for (const productId of productIds) {
        await this.connection.rawConnection.query(
          `INSERT INTO product_search_stats ("productId", "productName", "votes")
           VALUES ($1, 'Search Item', 1)
           ON CONFLICT ("productId")
           DO UPDATE SET "votes" = product_search_stats."votes" + 1,
                         "updatedAt" = NOW()`,
          [productId],
        );
      }
    } catch (error) {
      // Non-fatal, just log and continue
      console.error('Failed to record search impressions in DB', error);
    }
  }
  private async enrichWithSales(ctx: RequestContext, products: Product[]) {
    if (!products.length) return products;
    const variantsToEnrich = products
      .map((p) => {
        const variant = p.variants?.[0];
        const price = variant?.productVariantPrices?.[0]?.price ?? 0;
        return variant ? { id: Number(variant.id), price } : null;
      })
      .filter(Boolean) as Array<{ id: number; price: number }>;
    const salesMap = await this.activeSaleService.getActiveSalesForVariants(
      ctx,
      variantsToEnrich,
    );
    return products.map((p) => {
      const variant = p.variants?.[0];
      const sale = variant ? salesMap.get(Number(variant.id)) : null;
      (p as any).sale = sale;
      return p;
    });
  }
}
