import {
  EventBus,
  AccountRegistrationEvent,
  PasswordResetEvent,
  TransactionalConnection,
  User,
  Customer,
  NativeAuthenticationMethod,
  CustomerService,
  CustomerEvent,
  PasswordCipher,
} from "@vendure/core";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { EmailVerificationEvent } from "../../shared/events";
import { SmsService } from "./sms.service";

@Injectable()
export class AuthEventHandler implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private connection: TransactionalConnection,
    private customerService: CustomerService,
    private smsService: SmsService,
    private passwordCipher: PasswordCipher,
  ) { }

  onModuleInit() {
    this.eventBus.ofType(AccountRegistrationEvent).subscribe(async (event) => {
      const { ctx, user } = event;

      const userWithMethods = await this.connection
        .getRepository(ctx, User)
        .findOne({
          where: { id: user.id },
          relations: ["authenticationMethods"],
        });

      if (!userWithMethods) {
        return;
      }

      const customer = await this.customerService.findOneByUserId(ctx, user.id);

      if (customer && !customer.phoneNumber) {
        customer.phoneNumber = user.identifier;
        await this.connection.getRepository(ctx, Customer).save(customer);
      }

      const nativeMethod = userWithMethods.authenticationMethods.find(
        (m) => m instanceof NativeAuthenticationMethod,
      ) as NativeAuthenticationMethod | undefined;

      if (nativeMethod && nativeMethod.verificationToken) {
        const identifier = userWithMethods.identifier;
        if (identifier.includes("@")) {
          this.eventBus.publish(
            new EmailVerificationEvent(
              ctx,
              identifier,
              nativeMethod.verificationToken,
            ),
          );
        } else {
          // Log or call SMS service for phone-based registration
          this.smsService.sendOtp(identifier, nativeMethod.verificationToken);
        }
      } else {
      }
    });

    // Send OTP on password reset request
    this.eventBus.ofType(PasswordResetEvent).subscribe(async (event) => {
      const { ctx, user } = event;
      const userWithMethods = await this.connection
        .getRepository(ctx, User)
        .findOne({
          where: { id: user.id },
          relations: ["authenticationMethods"],
        });

      if (!userWithMethods) return;

      const nativeMethod = userWithMethods.authenticationMethods.find(
        (m) => m instanceof NativeAuthenticationMethod,
      ) as NativeAuthenticationMethod | undefined;

      if (nativeMethod && nativeMethod.passwordResetToken) {
        // Publish event or call service to send OTP
        if (userWithMethods.identifier.includes("@")) {
          this.eventBus.publish(
            new EmailVerificationEvent(
              ctx,
              userWithMethods.identifier,
              nativeMethod.passwordResetToken,
            ),
          );
        } else {
          const customer = await this.customerService.findOneByUserId(
            ctx,
            userWithMethods.id,
          );
          if (customer && customer.phoneNumber) {
            this.smsService.sendOtp(
              customer.phoneNumber,
              nativeMethod.passwordResetToken,
            );
          }
        }
      } else {
      }
    });

    // Handle admin-initiated password change via 'password' custom field
    this.eventBus.ofType(CustomerEvent).subscribe(async (event) => {
      const { ctx, entity, type, input } = event;
      if (type !== "updated" || !input || typeof input === "string") {
        return;
      }

      const password = (input as any).customFields?.password;
      if (password) {
        const user = await this.connection.getRepository(ctx, User).findOne({
          where: { id: entity.user?.id },
          relations: ["authenticationMethods"],
        });

        if (user) {
          const nativeMethod = user.authenticationMethods.find(
            (m) => m instanceof NativeAuthenticationMethod,
          ) as NativeAuthenticationMethod | undefined;

          if (nativeMethod) {
            nativeMethod.passwordHash =
              await this.passwordCipher.hash(password);
            await this.connection
              .getRepository(ctx, NativeAuthenticationMethod)
              .save(nativeMethod);
          }

          // Clear the password field so it's not stored in plain text
          entity.customFields.password = null as any;
          await this.connection.getRepository(ctx, Customer).save(entity);
        }
      }
    });
  }
}
