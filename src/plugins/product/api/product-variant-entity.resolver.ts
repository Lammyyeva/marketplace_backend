import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ProductVariant, TransactionalConnection, StockLevel } from "@vendure/core";

@Resolver("ProductVariant")
export class ProductVariantEntityResolver {
  constructor(private connection: TransactionalConnection) {}

  @ResolveField()
  async stockOnHand(@Parent() variant: ProductVariant): Promise<number> {
    const stockLevels = await this.connection.getRepository(StockLevel).find({
      where: { productVariant: { id: variant.id } },
    });
    
    // Sum up stock from all locations
    return stockLevels.reduce((total, sl) => total + sl.stockOnHand, 0);
  }
}
