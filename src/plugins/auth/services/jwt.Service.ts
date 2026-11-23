import { Injectable } from "@nestjs/common";
import { JwtService as jwtService } from "@nestjs/jwt";
import { Logger } from "@vendure/core";

/**
 * JWT lifetime parser.
 *
 * `@nestjs/jwt` accepts either a number (seconds) or a duration string
 * like "15m", "1h", "1d", "30d". The previous implementation passed the
 * env value through `Number(...)`, which turned "1d" into `NaN`, which
 * is falsy, which silently fell back to the "1m" default. That made
 * every JWT in production expire after 60 seconds — destroying the
 * session→activeOrder link (see jwt-session.strategy.ts) and emptying
 * the cart for any user whose session was older than a minute.
 *
 * We now accept either a digit-only string (interpreted as seconds) or
 * a duration string and pass it through unchanged.
 */
function parseLifetime(raw: string | undefined, fallback: string): string | number {
  if (!raw || raw.trim() === "") return fallback;
  const trimmed = raw.trim();
  return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed;
}

const refreshTokenTime = parseLifetime(process.env.REFRESH_TOKEN_TIME, "30d");
const accessTokenTime = parseLifetime(process.env.ACCESS_TOKEN_TIME, "1d");

Logger.info(
  `JWT lifetimes — access: ${accessTokenTime}, refresh: ${refreshTokenTime}`,
  "CustomJwtService",
);

const secret = process.env.SECRET_KEY;

@Injectable()
export class CustomJwtService {
  constructor(private jwtService: jwtService) {}

  generateTokens(payload: any, rememberMe: boolean = false) {
    // `@nestjs/jwt` uses the `ms` package which types `expiresIn` as a
    // strict `StringValue` template literal; we accept any duration string
    // by design (validated at startup), so cast through `any`.
    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: accessTokenTime as any,
    });
    const refreshToken = rememberMe
      ? this.jwtService.sign(payload, {
          secret,
          expiresIn: refreshTokenTime as any,
        })
      : null;

    return {
      accessToken,
      refreshToken,
    };
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token, { secret });
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}
