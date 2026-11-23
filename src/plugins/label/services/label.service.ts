import { Injectable } from "@nestjs/common";
import {
  ID,
  RequestContext,
  TransactionalConnection,
  Asset,
  TranslatableSaver,
  TranslatorService,
  ListQueryBuilder,
  ListQueryOptions,
  PaginatedList,
  assertFound,
} from "@vendure/core";
import { DeletionResult } from "@vendure/common/lib/generated-types";
import { Label } from "../entities/label.entity";
import { LabelTranslation } from "../entities/label-translation.entity";
import {
  CreateLabelInput,
  UpdateLabelInput,
} from "../../generated/generated-admin-types";

@Injectable()
export class LabelService {
  constructor(
    private connection: TransactionalConnection,
    private translatableSaver: TranslatableSaver,
    private translator: TranslatorService,
    private listQueryBuilder: ListQueryBuilder,
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<Label>,
  ): Promise<PaginatedList<Label>> {
    const [items, totalItems] = await this.listQueryBuilder
      .build(Label, options, {
        ctx,
        relations: ["featuredAsset", "translations"],
      })
      .getManyAndCount();

    return {
      items: items.map((label) => this.translator.translate(label, ctx)),
      totalItems,
    };
  }

  async findOne(ctx: RequestContext, id: ID): Promise<Label | undefined> {
    const label = await this.connection.getRepository(ctx, Label).findOne({
      where: { id },
      relations: ["featuredAsset", "translations"],
    });
    return label ? this.translator.translate(label, ctx) : undefined;
  }

  async create(ctx: RequestContext, input: CreateLabelInput): Promise<Label> {
    const label = await this.translatableSaver.create({
      ctx,
      input,
      entityType: Label,
      translationType: LabelTranslation,
      beforeSave: async (l) => {
        if (input.featuredAssetId) {
          l.featuredAsset = { id: input.featuredAssetId } as Asset;
        }
      },
    });
    return assertFound(this.findOne(ctx, label.id));
  }

  async update(ctx: RequestContext, input: UpdateLabelInput): Promise<Label> {
    const label = await this.translatableSaver.update({
      ctx,
      input,
      entityType: Label,
      translationType: LabelTranslation,
      beforeSave: async (l) => {
        if (input.featuredAssetId !== undefined) {
          l.featuredAsset = input.featuredAssetId
            ? ({ id: input.featuredAssetId } as Asset)
            : (null as any);
        }
      },
    });
    return assertFound(this.findOne(ctx, label.id));
  }

  async delete(ctx: RequestContext, id: ID) {
    const protectedIds = [
      process.env.NEW_ID,
      process.env.SEASON_ID,
    ].filter(Boolean);

    if (protectedIds.includes(id.toString())) {
      throw new Error(
        `Label with ID ${id} is a static label and cannot be deleted.`,
      );
    }

    const label = await this.connection.getEntityOrThrow(ctx, Label, id);
    await this.connection.getRepository(ctx, Label).softRemove(label);
    return {
      result: DeletionResult.DELETED,
      message: `Label ${id} deleted successfully`,
    };
  }
}
