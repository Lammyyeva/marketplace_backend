import { EmailEventListener } from "@vendure/email-plugin";
import { EmailVerificationEvent } from "../../shared/events";

export const emailVerificationHandler = new EmailEventListener(
  "email-verification",
)
  .on(EmailVerificationEvent)
  .setRecipient((event) => event.email)
  .setFrom("{{ fromAddress }}")
  .setSubject("your confirmation-code")
  .setTemplateVars((event) => {
    return {
      otpNumber: event.otp,
    };
  });
