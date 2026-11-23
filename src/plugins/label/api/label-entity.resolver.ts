import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import {
  TransactionalConnection,
  Asset,
  TranslatorService,
  RequestContext,
  Ctx,
} from "@vendure/core";
import { Label } from "../entities/label.entity";

@Resolver("Label")
export class LabelEntityResolver {
  constructor(
    private connection: TransactionalConnection,
    private translator: TranslatorService,
  ) {}

  @ResolveField()
  name(@Parent() label: Label, @Ctx() ctx: RequestContext): string {
    return this.translator.translate(label, ctx).name;
  }

  @ResolveField()
  async featuredAsset(@Parent() label: Label): Promise<Asset | null> {
    if (label.featuredAsset && label.featuredAsset.preview) {
      return label.featuredAsset;
    }
    const labelWithAsset = await this.connection.getRepository(Label).findOne({
      where: { id: label.id },
      relations: ["featuredAsset"],
    });
    return labelWithAsset?.featuredAsset || null;
  }
}
