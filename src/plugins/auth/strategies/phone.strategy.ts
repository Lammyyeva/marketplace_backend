import { Injectable } from "@nestjs/common";
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

@Injectable()
export class PhoneLoginStrategy implements AuthenticationStrategy<{
  phoneNumber: string;
  password: string;
}> {
  readonly name = "phoneLogin";
  private connection: TransactionalConnection;
  private passwordCipher: PasswordCipher;

  init(injector: Injector) {
    this.connection = injector.get(TransactionalConnection);
    this.passwordCipher = injector.get(PasswordCipher);
  }

  defineInputType(): DocumentNode {
    return gql`
      input PhoneAuthInput {
        phoneNumber: String!
        password: String!
      }
    `;
  }

  async authenticate(
    ctx: RequestContext,
    data: { phoneNumber: string; password: string },
  ): Promise<User | false | string> {
    const user = await this.connection
      .getRepository(ctx, User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.authenticationMethods", "authMethod")
      .addSelect("authMethod.passwordHash")
      .leftJoin("user.roles", "roles")
      .leftJoin("roles.channels", "channels")
      .where("user.identifier = :phone", {
        phone: data.phoneNumber,
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

    if (!nativeAuthMethod) {
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
