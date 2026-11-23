import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { Like } from "./entities/like.entity";
import { LikeProductVariantService } from "./services/like.service";
import { likeShopApiExtensions } from "./api/api-extensions";
import {
  LikeProductVariantResolver,
  ProductVariantLikeResolver,
  SearchResultLikeResolver,
} from "./api/like.resolver";

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [Like],
  providers: [LikeProductVariantService],
  shopApiExtensions: {
    schema: likeShopApiExtensions,
    resolvers: [
      LikeProductVariantResolver,
      ProductVariantLikeResolver,
      SearchResultLikeResolver,
    ],
  },
})
export class LikePlugin {}
