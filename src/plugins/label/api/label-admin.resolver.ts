import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ID,
  ListQueryOptions,
  PaginatedList,
  Permission,
  RequestContext,
  Transaction,
} from "@vendure/core";
import { LabelService } from "../services/label.service";
import { Label } from "../entities/label.entity";
import {
  CreateLabelInput,
  DeletionResponse,
  UpdateLabelInput,
} from "../../generated/generated-admin-types";

@Resolver("Label")
export class LabelAdminResolver {
  constructor(private labelService: LabelService) {}

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  async labels(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: ListQueryOptions<Label> },
  ): Promise<PaginatedList<Label>> {
    return this.labelService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  async label(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<Label | undefined> {
    return this.labelService.findOne(ctx, args.id);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.CreateCatalog)
  async createLabel(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateLabelInput },
  ): Promise<Label> {
    return this.labelService.create(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async updateLabel(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateLabelInput },
  ): Promise<Label> {
    return this.labelService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog)
  async deleteLabel(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<DeletionResponse> {
    return this.labelService.delete(ctx, args.id);
  }

}
