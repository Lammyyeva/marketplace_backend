import {
  CachedSession,
  Injector,
  Logger,
  SessionCacheStrategy,
  TransactionalConnection,
  User,
  CacheService,
  AuthenticatedSession,
} from "@vendure/core";
import { Request } from "express";
import { CustomJwtService } from "../services/jwt.Service";

/**
 * Session cache strategy for JWT-authenticated requests.
 *
 * Design contract:
 *   - The bearer token presented by the client is a JWT containing
 *     `{ id, identifier, exp, ... }`.
 *   - There is exactly one AuthenticatedSession row per User, holding the
 *     `activeOrderId`. Its `token` column is rebound to the current JWT on
 *     each request so Vendure's framework can resolve session→user.
 *   - When a JWT expires, the user calls the `refreshToken` query to mint
 *     a new JWT. The next request with that new JWT will find the EXISTING
 *     session row (matched by user.id), update its token+expires fields,
 *     and preserve `activeOrderId`. **Therefore we must NOT delete the
 *     session row when the current JWT expires** — doing so destroys the
 *     cart and forces the user to start a new order after every token
 *     rotation.
 */
export class JwtSessionCacheStrategy implements SessionCacheStrategy {
  private connection!: TransactionalConnection;
  private jwtService!: CustomJwtService;
  private cacheService!: CacheService;
  private readonly loggerCtx = "JwtSessionCacheStrategy";

  init(injector: Injector) {
    this.connection = injector.get(TransactionalConnection);
    this.jwtService = injector.get(CustomJwtService);
    this.cacheService = injector.get(CacheService);
  }

  async get(
    sessionToken: string,
    _request?: Request,
  ): Promise<CachedSession | undefined> {
    if (!sessionToken) {
      return undefined;
    }

    // Quick rejection of non-JWT tokens (e.g. Vendure's anonymous session
    // tokens have no dots). Bypassing JWT verification here avoids needless
    // exceptions.
    const isJwtShape = sessionToken.split(".").length === 3;
    if (!isJwtShape) {
      return undefined;
    }

    let decoded: any;
    try {
      this.jwtService.verifyToken(sessionToken);
      decoded = this.jwtService.decodeToken(sessionToken);
    } catch {
      // JWT is invalid or expired. DO NOT delete the AuthenticatedSession —
      // the refreshToken flow will mint a new JWT that re-binds to the same
      // session row, preserving activeOrderId. Treat this request as
      // anonymous so the framework returns the appropriate UNAUTHORIZED
      // error, which the client interceptor converts into a refresh.
      return undefined;
    }

    if (!decoded || !decoded.id) {
      return undefined;
    }

    const tokenHash = sessionToken.substring(sessionToken.length - 8);
    const cacheKey = `jwt-session:${decoded.id}:${tokenHash}`;
    const cachedUserSession = (await this.cacheService.get(cacheKey)) as any;

    if (cachedUserSession) {
      if (typeof cachedUserSession.expires === "string") {
        cachedUserSession.expires = new Date(cachedUserSession.expires);
      }

      if (cachedUserSession.expires < new Date()) {
        await this.cacheService.delete(cacheKey);
        // Note: deliberately not touching the DB session row here either.
        return undefined;
      }

      return { ...cachedUserSession, token: sessionToken };
    }

    try {
      const user = await this.connection.rawConnection
        .getRepository(User)
        .findOne({
          where: { id: decoded.id },
          relations: ["roles", "roles.channels"],
        });

      if (!user) {
        return undefined;
      }

      // Always keep exactly ONE AuthenticatedSession per user. Take the most
      // recent row (in case historical duplicates exist) and rebind it to
      // the current JWT. activeOrderId is preserved across token rotations.
      let dbSession = await this.connection.rawConnection
        .getRepository(AuthenticatedSession)
        .findOne({
          where: { user: { id: user.id } },
          order: { createdAt: "DESC" },
        });

      const jwtExpiresAt = new Date(decoded.exp * 1000);

      if (!dbSession) {
        const newSession = this.connection.rawConnection
          .getRepository(AuthenticatedSession)
          .create({
            token: sessionToken,
            user: user,
            expires: jwtExpiresAt,
            invalidated: false,
            activeChannelId: decoded.activeChannelId ?? 1,
          } as any);
        dbSession = (await this.connection.rawConnection
          .getRepository(AuthenticatedSession)
          .save(newSession)) as unknown as AuthenticatedSession;
        Logger.info(`Created session for user ${user.id}`, this.loggerCtx);
      } else {
        // Rebind token + extend expiry so the session survives across token
        // rotations and the cleanup cron does not sweep it up. activeOrderId
        // is left untouched.
        const needsTokenUpdate = dbSession.token !== sessionToken;
        const needsExpiryUpdate = !dbSession.expires || dbSession.expires < jwtExpiresAt;
        if (needsTokenUpdate || needsExpiryUpdate) {
          dbSession.token = sessionToken;
          dbSession.expires = jwtExpiresAt;
          dbSession = await this.connection.rawConnection
            .getRepository(AuthenticatedSession)
            .save(dbSession);
        }
      }

      const channelPermissions = user.roles.flatMap((role) =>
        role.channels.map((channel) => ({
          id: channel.id,
          token: channel.token,
          code: role.code,
          permissions: role.permissions,
        })),
      );

      const session: CachedSession = {
        id: dbSession.id,
        token: sessionToken,
        expires: jwtExpiresAt,
        cacheExpiry: decoded.exp,
        user: {
          id: user.id,
          identifier: user.identifier,
          verified: user.verified,
          channelPermissions,
        },
        activeChannelId: decoded.activeChannelId,
        activeOrderId: dbSession.activeOrderId,
      };

      const ttl = decoded.exp * 1000 - Date.now();
      if (ttl > 0) {
        await this.cacheService.set(cacheKey, session as any, { ttl });
      }

      return session;
    } catch (err: any) {
      Logger.warn(`Session lookup failed: ${err?.message}`, this.loggerCtx);
      return undefined;
    }
  }

  async set(session: CachedSession): Promise<void> {
    // Persist the cached session (called by Vendure after setActiveOrder etc.)
    let decoded: any;
    try {
      decoded = this.jwtService.decodeToken(session.token);
    } catch {
      return;
    }

    if (!decoded?.id || !decoded.exp) {
      return;
    }

    const ttl = decoded.exp * 1000 - Date.now();
    if (ttl <= 0) {
      return;
    }

    const tokenHash = session.token.substring(session.token.length - 8);
    const cacheKey = `jwt-session:${decoded.id}:${tokenHash}`;
    await this.cacheService.set(cacheKey, session as any, { ttl });
  }

  async delete(sessionToken: string): Promise<void> {
    // Called explicitly on logout. Remove the cache entry AND the DB row so
    // the user is fully signed out.
    let decoded: any;
    try {
      decoded = this.jwtService.decodeToken(sessionToken);
    } catch {
      return;
    }
    if (decoded?.id) {
      const tokenHash = sessionToken.substring(sessionToken.length - 8);
      const cacheKey = `jwt-session:${decoded.id}:${tokenHash}`;
      await this.cacheService.delete(cacheKey);
      // Note: matching on token is fine here because logout is intentional.
      // We delete by user.id to cover the case where the in-DB token has
      // already been rebound to a newer JWT than the one used to call logout.
      await this.connection.rawConnection
        .getRepository(AuthenticatedSession)
        .delete({ user: { id: decoded.id } } as any);
    }
  }

  async clear(): Promise<void> {}
}
