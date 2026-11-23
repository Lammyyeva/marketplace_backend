import { Injectable } from "@nestjs/common";
import {
  CacheService,
  Customer,
  Logger,
  NativeAuthenticationMethod,
  PasswordCipher,
  RequestContext,
  TransactionalConnection,
  UnauthorizedError,
  User,
  UserInputError,
} from "@vendure/core";
import { REFRESH_TOKEN_COUNT } from "../../../apps/server/src/shared/constants";
import { CustomJwtService } from "./jwt.Service";
import { OtpService } from "./otp.service";
import { SmsService } from "./sms.service";

const loggerCtx = "CustomAuthService";

// Scope label used for phone password-reset OTPs in the shared OtpService.
const PHONE_RESET_SCOPE = "pwd-phone";

@Injectable()
export class CustomAuthService {
  constructor(
    private cacheService: CacheService,
    private jwtService: CustomJwtService,
    private connection: TransactionalConnection,
    private passwordCipher: PasswordCipher,
    private otpService: OtpService,
    private smsService: SmsService,
  ) {}

  async refreshToken(ctx: RequestContext, refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedError();
    }

    // jwtService.verify throws on an invalid/expired token; translate that
    // into a clean 401 rather than letting it bubble up as a 500.
    let decodedUser: any;
    try {
      this.jwtService.verifyToken(refreshToken);
      decodedUser = this.jwtService.decodeToken(refreshToken);
    } catch {
      throw new UnauthorizedError();
    }
    if (!decodedUser) {
      throw new UserInputError("this token is impossible to decode");
    }

    const refreshTokenCount = Number(
      await this.cacheService.get(
        `${REFRESH_TOKEN_COUNT}: ${decodedUser.identifier}`,
      ),
    );
    if (refreshTokenCount >= Number(process.env.REFRESH_TOKEN_LIMIT)) {
      throw new UnauthorizedError();
    }

    await this.cacheService.set(
      `${REFRESH_TOKEN_COUNT}: ${decodedUser.identifier}`,
      refreshTokenCount + 1,
    );

    const jwtPayload = {
      id: decodedUser.id,
      identifier: decodedUser.identifier,
      verified: decodedUser.verified,
      activeChannelId: decodedUser.activeChannelId,
      permissions: decodedUser.permissions,
    };

    const { accessToken } = this.jwtService.generateTokens(jwtPayload, false);
    return accessToken;
  }

  /**
   * Strips formatting/country-code so lookups are consistent regardless of how
   * the client submits the number (e.g. "+993 65 123456" → "65123456").
   */
  private normalizePhone(phoneNumber: string): string {
    const digits = (phoneNumber || "").replace(/\D/g, "");
    return digits.startsWith("993") ? digits.slice(3) : digits;
  }

  private async findUserByPhone(
    ctx: RequestContext,
    phoneNumber: string,
  ): Promise<User | undefined> {
    // Explicitly select only the columns we need. A plain findOne() would
    // select every Customer column, including custom fields — which both
    // pulls in a sensitive `password` custom field we have no business
    // reading and breaks outright if that column hasn't been migrated yet.
    const customer = await this.connection
      .getRepository(ctx, Customer)
      .createQueryBuilder("customer")
      .select(["customer.id"])
      .leftJoinAndSelect("customer.user", "user")
      .leftJoinAndSelect("user.authenticationMethods", "authMethod")
      .where("customer.phoneNumber = :phone", { phone: phoneNumber })
      .andWhere("customer.deletedAt IS NULL")
      .getOne();
    return customer?.user ?? undefined;
  }

  /**
   * Step 1 of phone recovery: generate + SMS an OTP. Always resolves to a
   * generic success to avoid leaking which phone numbers are registered
   * (account-enumeration protection). Rate limiting / brute-force protection
   * are enforced inside OtpService.
   */
  async requestPhonePasswordReset(
    ctx: RequestContext,
    phoneNumber: string,
  ): Promise<{ success: boolean; message: string }> {
    const phone = this.normalizePhone(phoneNumber);
    const genericMessage =
      "If an account exists for this phone number, a code has been sent.";

    const user = await this.findUserByPhone(ctx, phone);
    if (!user) {
      Logger.info(`Phone reset requested for unknown number`, loggerCtx);
      return { success: true, message: genericMessage };
    }

    const code = await this.otpService.generate(PHONE_RESET_SCOPE, phone);
    if (!code) {
      // Rate-limited — surface a distinct, non-enumerating message.
      return {
        success: false,
        message: "Too many requests. Please try again later.",
      };
    }

    const sent = await this.smsService.sendOtp(phone, code);
    if (!sent) {
      Logger.error(`Failed to send phone reset OTP`, loggerCtx);
      return {
        success: false,
        message: "Could not send the verification code. Please try again.",
      };
    }
    return { success: true, message: genericMessage };
  }

  /**
   * Step 2 of phone recovery: verify the OTP (single-use, expiry, brute-force
   * lockout) and, on success, set the new password directly on the user's
   * native authentication method.
   */
  async resetPasswordByPhone(
    ctx: RequestContext,
    phoneNumber: string,
    code: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!newPassword || newPassword.length < 8) {
      throw new UserInputError("Password must be at least 8 characters long");
    }

    const phone = this.normalizePhone(phoneNumber);
    const result = await this.otpService.verify(PHONE_RESET_SCOPE, phone, code);
    if (!result.ok) {
      const message =
        result.reason === "locked"
          ? "Too many incorrect attempts. Please request a new code."
          : "Invalid or expired verification code.";
      throw new UserInputError(message);
    }

    const user = await this.findUserByPhone(ctx, phone);
    if (!user) {
      // OTP verified but the account vanished (deleted between steps).
      throw new UserInputError("Account not found.");
    }

    const nativeMethod = user.authenticationMethods?.find(
      (m): m is NativeAuthenticationMethod =>
        m instanceof NativeAuthenticationMethod,
    );
    if (!nativeMethod) {
      throw new UserInputError(
        "This account does not use password authentication.",
      );
    }

    nativeMethod.passwordHash = await this.passwordCipher.hash(newPassword);
    // Invalidate any pending reset/verification tokens now the password changed.
    nativeMethod.passwordResetToken = null as any;
    await this.connection
      .getRepository(ctx, NativeAuthenticationMethod)
      .save(nativeMethod);

    Logger.info(`Password reset via phone OTP for user ${user.id}`, loggerCtx);
    return { success: true, message: "Password has been reset successfully." };
  }
}
