import {
  AuthService,
  NativeAuthenticationStrategy,
  PluginCommonModule,
  VendurePlugin,
} from "@vendure/core";
import { ScheduleModule } from "@nestjs/schedule";
import { CustomAuthService } from "./services/auth.service";
import { AnonymousSessionCleanupService } from "./services/anonymous-session-cleanup.service";
import { PhoneLoginStrategy } from "./strategies/phone.strategy";
import { SmsService } from "./services/sms.service";
import { OtpService } from "./services/otp.service";
import { CustomJwtService } from "./services/jwt.Service";
import { JwtModule } from "@nestjs/jwt";
import { AppleAuthenticationStrategy } from "./strategies/apple.strategy";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { JwtSessionCacheStrategy } from "./strategies/jwt-session.strategy";
import { GoogleAuthenticationStrategy } from "./strategies/google.strategy";
import { EmailAuthenticationStrategy } from "./strategies/email.strategy";
import { OtpVerificationTokenStrategy } from "./strategies/otp-verification.strategy";
import { AuthInterceptor } from "./guards/auth.interceptor";
import { AuthEventHandler } from "./services/auth-event.handler";
import { CustomAuthResolver } from "./api/auth.resolver";
import { AuthSchema } from "./api/schema";

@VendurePlugin({
  imports: [
    PluginCommonModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  providers: [
    CustomAuthService,
    CustomJwtService,
    NativeAuthenticationStrategy,
    AuthService,
    AnonymousSessionCleanupService,
    SmsService,
    OtpService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
    AuthEventHandler,
  ],
  configuration: (config) => {
    config.authOptions.shopAuthenticationStrategy.push(
      new EmailAuthenticationStrategy(),
      new PhoneLoginStrategy(),
      new GoogleAuthenticationStrategy(process.env.CLIENT_ID || "mock-id"),
      new AppleAuthenticationStrategy(),
    );
    config.authOptions.verificationTokenStrategy =
      new OtpVerificationTokenStrategy();
    config.authOptions.sessionDuration = "1d";
    config.authOptions.sessionCacheStrategy = new JwtSessionCacheStrategy();
    config.authOptions.disableAuth = false;

    return config;
  },
  shopApiExtensions: {
    schema: AuthSchema,
    resolvers: [CustomAuthResolver],
  },
  adminApiExtensions: {
    schema: AuthSchema,
    resolvers: [CustomAuthResolver],
  },
  dashboard: {
    location: "./dashboard",
  },
  compatibility: "^3.0.0",
})
export class AuthPlugin {}
