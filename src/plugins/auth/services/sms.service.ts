import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendOtp(phoneNumber: string, otp: string): Promise<boolean> {
    const url = process.env.OTP_URL;
    const username = process.env.OTP_USERNAME;
    const password = process.env.OTP_PASSWORD;

    if (!url || !username || !password) {
      return false;
    }

    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    const fullNumber = `+993${phoneNumber}`;

    const body = JSON.stringify({
      number: fullNumber,
      text: `SMS kod: ${otp}`,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: body,
      });

      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      this.logger.error(`Failed to connect to SMS service: ${error.message}`);
      return false;
    }
  }
}
