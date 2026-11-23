import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  Permission,
  RequestContext,
  Transaction,
  CustomerService,
} from "@vendure/core";
import { CustomAuthService } from "../services/auth.service";

@Resolver()
export class CustomAuthResolver {
  constructor(
    private authService: CustomAuthService,
    private customerService: CustomerService,
  ) {}

  @Allow(Permission.Public)
  @Transaction()
  @Query()
  async refreshToken(
    @Ctx() ctx: RequestContext,
    @Args("refreshToken") refreshToken: string,
  ) {
    const accessToken = await this.authService.refreshToken(ctx, refreshToken);

    return {
      success: true,
      message: "access token was set successfully",
      accessToken,
    };
  }

  @Allow(Permission.Public)
  @Transaction()
  @Mutation()
  async requestPhonePasswordReset(
    @Ctx() ctx: RequestContext,
    @Args("phoneNumber") phoneNumber: string,
  ) {
    return this.authService.requestPhonePasswordReset(ctx, phoneNumber);
  }

  @Allow(Permission.Public)
  @Transaction()
  @Mutation()
  async resetPasswordByPhone(
    @Ctx() ctx: RequestContext,
    @Args("phoneNumber") phoneNumber: string,
    @Args("code") code: string,
    @Args("newPassword") newPassword: string,
  ) {
    return this.authService.resetPasswordByPhone(
      ctx,
      phoneNumber,
      code,
      newPassword,
    );
  }

  @Allow(Permission.Owner)
  @Transaction()
  @Mutation()
  async deleteCustomerAccount(@Ctx() ctx: RequestContext) {
    const customer = await this.customerService.findOneByUserId(
      ctx,
      ctx.activeUserId!,
    );
    if (!customer) {
      return {
        result: "NOT_DELETED",
        message: "Customer not found",
      };
    }

    const deletionResponse = await this.customerService.softDelete(ctx, customer.id);
    return {
      result: deletionResponse.result,
      message: deletionResponse.message,
    };
  }
}
