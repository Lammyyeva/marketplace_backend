import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { RequestContext, CacheService, ConfigService } from "@vendure/core";
import { REFRESH_TOKEN_COUNT } from "../../../apps/server/src/shared/constants";
import { CustomJwtService } from "../services/jwt.Service";

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private jwtService: CustomJwtService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();

    return next.handle().pipe(
      switchMap(async (data) => {
        const resolvedData = await data;

        const isAuthWithRememberMe =
          info.fieldName === "authenticate" || info.fieldName === "login";

        const isVerificationFlow =
          info.fieldName === "resetPassword" ||
          info.fieldName === "verifyCustomerAccount";

        if ((isAuthWithRememberMe || isVerificationFlow) && resolvedData) {
          const userId =
            resolvedData.id ||
            resolvedData.user?.id ||
            resolvedData.customer?.id;

          if (userId) {
            const ctx: RequestContext =
              gqlContext.getContext().req.vendureRequestContext;
            const args = gqlContext.getArgs();

            // Always true for verification/reset, otherwise check the rememberMe argument
            const rememberMe: boolean = isAuthWithRememberMe
              ? (args.rememberMe ?? false)
              : true;

            const jwtPayload = {
              id: userId,
              identifier: resolvedData.identifier,
              verified: resolvedData.verified,
              activeChannelId: ctx.channelId,
              permissions: resolvedData.permissions,
            };

            const { accessToken, refreshToken } =
              this.jwtService.generateTokens(jwtPayload, rememberMe);

            if (
              info.fieldName === "authenticate" ||
              info.fieldName === "login" ||
              info.fieldName === "verifyCustomerAccount" ||
              info.fieldName === "resetPassword"
            ) {
              this.cacheService.set(
                `${REFRESH_TOKEN_COUNT}: ${resolvedData.identifier}`,
                "0",
              );
            }

            return {
              ...resolvedData,
              accessToken,
              refreshToken: rememberMe ? refreshToken : null,
            };
          }
        }

        if (info.fieldName === "logout") {
          const token = gqlContext
            .getContext()
            .req.headers.authorization?.substring(7);

          if (token) {
            await this.configService.authOptions.sessionCacheStrategy?.delete(
              token,
            );
          }
        }

        return resolvedData;
      }),
    );
  }
}
