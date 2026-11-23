import {
  AuthenticationStrategy,
  Injector,
  RequestContext,
  TransactionalConnection,
  User,
  NativeAuthenticationMethod,
  PasswordCipher,
} from "@vendure/core";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";

/**
 * Strategy for email-based login using the standard authenticate mutation.
 */
export class EmailAuthenticationStrategy implements AuthenticationStrategy<{
  emailAddress: string;
  password: string;
}> {
  readonly name = "email";
  private connection: TransactionalConnection;
  private passwordCipher: PasswordCipher;

  init(injector: Injector) {
    this.connection = injector.get(TransactionalConnection);
    this.passwordCipher = injector.get(PasswordCipher);
  }

  defineInputType(): DocumentNode {
    return gql`
      input EmailAuthInput {
        emailAddress: String!
        password: String!
      }
    `;
  }

  async authenticate(
    ctx: RequestContext,
    data: { emailAddress: string; password: string },
  ): Promise<User | false | string> {
    const user = await this.connection
      .getRepository(ctx, User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.authenticationMethods", "authMethod")
      .addSelect("authMethod.passwordHash")
      .leftJoin("user.roles", "roles")
      .leftJoin("roles.channels", "channels")
      .where("user.identifier = :identifier", {
        identifier: data.emailAddress,
      })
      .andWhere("channels.id = :channelId", { channelId: ctx.channelId })
      .getOne();

    if (!user) {
      return false;
    }

    const nativeAuthMethod = user.authenticationMethods.find(
      (m): m is NativeAuthenticationMethod =>
        m instanceof NativeAuthenticationMethod,
    );

    if (!nativeAuthMethod || !nativeAuthMethod.passwordHash) {
      return false;
    }

    const passwordMatch = await this.passwordCipher.check(
      data.password,
      nativeAuthMethod.passwordHash,
    );

    if (!passwordMatch) {
      return false;
    }

    if (!user.verified) {
      return "User not verified";
    }

    return user;
  }
}
