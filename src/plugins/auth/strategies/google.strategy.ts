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

const loggerCtx = "GoogleAuthenticationStrategy";

export type GoogleAuthData = {
  token: string;
};

interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
}

/**
 * Validates the Google OAuth **access token** produced by the frontend
 * `useGoogleLogin` (implicit) flow by calling Google's userinfo endpoint.
 * Google rejects expired/forged tokens, so a successful response proves the
 * token is genuine and yields the verified profile.
 *
 * Account resolution order:
 *   1. Return the user already linked to this Google account (`sub`).
 *   2. Otherwise, if a local account exists with the same email, link the
 *      Google identity to it (account linking).
 *   3. Otherwise create a new customer + user.
 */
export class GoogleAuthenticationStrategy
  implements AuthenticationStrategy<GoogleAuthData>
{
  readonly name = "google";
  private externalAuthenticationService: ExternalAuthenticationService;
  private connection: TransactionalConnection;

  // clientId is retained for forward-compatibility / logging; userinfo
  // validation does not require it.
  constructor(private clientId?: string) {}

  init(injector: Injector) {
    this.externalAuthenticationService = injector.get(
      ExternalAuthenticationService,
    );
    this.connection = injector.get(TransactionalConnection);
  }

  defineInputType(): DocumentNode {
    return gql`
      input GoogleAuthInput {
        token: String!
      }
    `;
  }

  private async fetchUserInfo(
    accessToken: string,
  ): Promise<GoogleUserInfo | null> {
    try {
      const res = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!res.ok) {
        // Log the upstream body so the real reason (invalid_token,
        // insufficient scope, etc.) is visible — not a generic failure.
        const body = await res.text().catch(() => "<unreadable>");
        Logger.warn(
          `Google userinfo rejected token (status ${res.status}): ${body}`,
          loggerCtx,
        );
        return null;
      }
      return (await res.json()) as GoogleUserInfo;
    } catch (e: any) {
      // A network failure here (e.g. the server cannot reach googleapis.com)
      // is a common production root cause — surface it explicitly.
      Logger.error(
        `Google userinfo fetch threw (server→Google connectivity?): ${e?.message}`,
        loggerCtx,
      );
      return null;
    }
  }

  async authenticate(
    ctx: RequestContext,
    data: GoogleAuthData,
  ): Promise<User | false | string> {
    Logger.info(
      `Google authenticate start (token length=${data.token?.length ?? 0})`,
      loggerCtx,
    );

    const profile = await this.fetchUserInfo(data.token);
    if (!profile) {
      Logger.warn("Google auth failed: no profile returned from userinfo", loggerCtx);
      return false;
    }
    if (!profile.sub || !profile.email) {
      Logger.warn(
        `Google auth failed: profile missing sub/email (sub=${!!profile.sub}, email=${!!profile.email})`,
        loggerCtx,
      );
      return false;
    }
    Logger.info(
      `Google profile resolved: email=${profile.email}, verified=${profile.email_verified}`,
      loggerCtx,
    );

    // 1. Already linked to this Google account.
    const linked = await this.externalAuthenticationService.findCustomerUser(
      ctx,
      this.name,
      profile.sub,
    );
    if (linked) {
      Logger.info(`Google login: existing linked user ${linked.id}`, loggerCtx);
      return linked;
    }

    // 2. Link to an existing local account with the same email.
    const userByEmail = await this.connection
      .getRepository(ctx, User)
      .findOne({ where: { identifier: profile.email } });
    if (userByEmail) {
      const method = new ExternalAuthenticationMethod({
        strategy: this.name,
        externalIdentifier: profile.sub,
        user: userByEmail,
      });
      await this.connection
        .getRepository(ctx, ExternalAuthenticationMethod)
        .save(method);
      Logger.info(
        `Linked Google account to existing user ${userByEmail.id}`,
        loggerCtx,
      );
      return userByEmail;
    }

    // 3. Create a brand-new customer + user. Wrap so the actual error
    // (e.g. an email-address conflict) is logged rather than bubbling up as
    // an opaque "Google Sign-In Failed".
    try {
      const created =
        await this.externalAuthenticationService.createCustomerAndUser(ctx, {
          strategy: this.name,
          externalIdentifier: profile.sub,
          verified: profile.email_verified ?? true,
          emailAddress: profile.email,
          firstName: profile.given_name || "",
          lastName: profile.family_name || "",
        });
      Logger.info(
        `Google login: created new customer/user ${created.id} for ${profile.email}`,
        loggerCtx,
      );
      return created;
    } catch (e: any) {
      Logger.error(
        `Google createCustomerAndUser failed for ${profile.email}: ${e?.message}`,
        loggerCtx,
      );
      throw e;
    }
  }
}
