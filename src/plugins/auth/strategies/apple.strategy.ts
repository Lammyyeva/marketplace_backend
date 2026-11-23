import {
  AuthenticationStrategy,
  ExternalAuthenticationService,
  ExternalAuthenticationMethod,
  Injector,
  Logger,
  RequestContext,
  TransactionalConnection,
  User,
} from "@vendure/core";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import appleSignIn, { AppleIdTokenType } from "apple-signin-auth";

const loggerCtx = "AppleAuthenticationStrategy";

export type AppleAuthData = {
  token: string;
  firstName?: string;
  lastName?: string;
};

/**
 * Validates an Apple identity token (JWT) against Apple's public keys.
 *
 * Apple only returns the user's email on the **first** authorization, so we
 * resolve the account by the stable `sub` first and only require an email when
 * we have to create/link a new account.
 */
export class AppleAuthenticationStrategy
  implements AuthenticationStrategy<AppleAuthData>
{
  readonly name = "apple";
  private externalAuthenticationService: ExternalAuthenticationService;
  private connection: TransactionalConnection;

  init(injector: Injector) {
    this.externalAuthenticationService = injector.get(
      ExternalAuthenticationService,
    );
    this.connection = injector.get(TransactionalConnection);
  }

  defineInputType(): DocumentNode {
    return gql`
      input AppleAuthInput {
        token: String!
        firstName: String
        lastName: String
      }
    `;
  }

  async authenticate(
    ctx: RequestContext,
    data: AppleAuthData,
  ): Promise<User | false | string> {
    const clientId = process.env.APPLE_CLIENT_ID;

    let payload: AppleIdTokenType;
    try {
      payload = await appleSignIn.verifyIdToken(data.token, {
        audience: clientId,
        ignoreExpiration: false,
      });
    } catch (e: any) {
      Logger.warn(`Apple token verification failed: ${e.message}`, loggerCtx);
      return false;
    }

    if (!payload || !payload.sub) {
      return false;
    }
    const externalIdentifier = payload.sub;

    // 1. Already linked to this Apple account (works even when Apple omits the
    //    email on repeat sign-ins).
    const linked = await this.externalAuthenticationService.findCustomerUser(
      ctx,
      this.name,
      externalIdentifier,
    );
    if (linked) {
      return linked;
    }

    // Email is only available to create/link a new account.
    const email = payload.email;
    if (!email) {
      Logger.warn(
        "Apple sign-in for unknown account returned no email; cannot create account",
        loggerCtx,
      );
      return false;
    }

    // 2. Link to an existing local account with the same email.
    const userByEmail = await this.connection
      .getRepository(ctx, User)
      .findOne({ where: { identifier: email } });
    if (userByEmail) {
      const method = new ExternalAuthenticationMethod({
        strategy: this.name,
        externalIdentifier,
        user: userByEmail,
      });
      await this.connection
        .getRepository(ctx, ExternalAuthenticationMethod)
        .save(method);
      Logger.info(
        `Linked Apple account to existing user ${userByEmail.id}`,
        loggerCtx,
      );
      return userByEmail;
    }

    // 3. Create a brand-new customer + user.
    return this.externalAuthenticationService.createCustomerAndUser(ctx, {
      strategy: this.name,
      externalIdentifier,
      verified: payload.email_verified === "true" || payload.email_verified === true,
      emailAddress: email,
      firstName: data.firstName || "Apple",
      lastName: data.lastName || "User",
    });
  }
}
