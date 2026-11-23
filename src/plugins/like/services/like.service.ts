import { Injectable } from "@nestjs/common";
import {
  ID,
  RequestContext,
  TransactionalConnection,
  User,
  ProductVariant,
} from "@vendure/core";
import { Like } from "../entities/like.entity";

@Injectable()
export class LikeProductVariantService {
  constructor(private connection: TransactionalConnection) {}

  async likeProductVariant(
    ctx: RequestContext,
    productVariantId: ID,
    userId: ID,
  ) {
    const likeRepo = this.connection.getRepository(ctx, Like);
    const existingLike = await likeRepo.findOne({
      where: {
        userId: userId,
        productVariantId: productVariantId,
      },
      relations: ["user", "productVariant"],
    });

    if (existingLike) {
      existingLike.isLike = !existingLike.isLike;
      return await likeRepo.save(existingLike);
    }

    const user = await this.connection.getEntityOrThrow(ctx, User, userId);
    const productVariant = await this.connection.getEntityOrThrow(
      ctx,
      ProductVariant,
      productVariantId,
    );

    const newLike = new Like({
      user,
      productVariant,
      isLike: true,
    });

    return await likeRepo.save(newLike);
  }

  async getLikesForUser(ctx: RequestContext, userId: ID) {
    return this.connection.getRepository(ctx, Like).find({
      where: {
        user: { id: userId },
        isLike: true,
      },
      relations: ["productVariant"],
    });
  }
}
