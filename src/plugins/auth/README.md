# 🔐 Authentication & Session Plugin

This plugin provides a robust, production-ready authentication and session management system for Vendure. It moves away from standard session tokens to a **JWT-based, dual-cookie architecture** with **silent rotation** and **Redis-backed caching**.

---

## 🚀 Key Features

- **Dual Token Architecture**: Uses `accessToken` (short-lived) and `refreshToken` (long-lived) stored in **HTTP-only, Signed Cookies**.
- **Silent Token Rotation**: A custom middleware automatically refreshes expired access tokens using the refresh token, providing a seamless user experience without manual frontend logic.
- **Multi-Strategy Support**:
  - **Phone Login**: custom strategy for login via phone number and password.
  - **Email Login**: Standard email/password authentication.
  - **Social Auth**: Integrated support for **Google** and **Apple** sign-in.
  - **OTP Verification**: 6-digit OTP codes for account verification with configurable TTL (default 5m).
- **High Performance**: Sessions are cached in **Redis** via a custom `JwtSessionCacheStrategy` to minimize database hits on every request.
- **Automatic Data Sync**: Automatically syncs phone numbers from the `User` entity to the `Customer` profile upon registration.
- **Security First**:
  - HTTP-only cookies prevent XSS-based token theft.
  - Refresh token abuse limits (configurable limit in Redis).
  - Signed cookies to prevent client-side tampering.

---

## 🛠 Architecture Overview

### 1. Token Issuance (`AuthInterceptor`)

Located at: `src/plugins/auth/guards/auth.interceptor.ts`

The interceptor monitors specific GraphQL mutations (`login`, `authenticate`, `resetPassword`). Upon success:

1.  Generates a JWT payload (userId, identifier, permissions).
2.  Creates Access and Refresh tokens via `CustomJwtService`.
3.  Attaches them to the response as signed, HTTP-only cookies via `CookieService`.
4.  Resets the refresh token counter in Redis for the user.

### 2. Silent Refresh (`CookieToBearerMiddleware`)

Located at: `src/plugins/auth/middleware/cookie-to-bearer.middleware.ts`

This middleware runs on every request to `shop-api` or `admin-api`:

1.  Checks for an `accessToken` cookie.
2.  If missing or expired, but a `refreshToken` exists:
    - Calls `CustomAuthService.refreshToken`.
    - Verifies the refresh token and checks abuse limits in Redis.
    - Generates a **new** token pair and updates the cookies.
3.  Injects the active `accessToken` into the `Authorization: Bearer <token>` header, making it compatible with Vendure's native auth logic.

### 3. Session Resolution (`JwtSessionCacheStrategy`)

Located at: `src/plugins/auth/strategies/jwt-session.strategy.ts`

Instead of the standard database lookup, this strategy:

1.  Decodes the JWT to find the `userId`.
2.  Checks **Redis** for a cached session (`jwt-session:<userId>:<hash>`).
3.  If not found, fetches the user from the DB, ensures an `AuthenticatedSession` exists (or creates one), and populates the cache.

---

## 📡 API Flow & Endpoints

### Registration & Login

| Step              | Logic                                            | Component                      |
| :---------------- | :----------------------------------------------- | :----------------------------- |
| **Registration**  | `registerCustomerAccount` mutation.              | `NativeAuthenticationStrategy` |
| **Post-Reg Sync** | Syncs `identifier` -> `Customer.phoneNumber`.    | `AuthEventHandler`             |
| **Login**         | Authenticates via Phone/Email/Social.            | `*AuthenticationStrategy`      |
| **Token Set**     | Cookies `accessToken` & `refreshToken` attached. | `AuthInterceptor`              |

### Token Rotation (Automatic)

The frontend does **not** need to handle 401 errors for token expiration manually. The middleware handles it:

- **Condition**: `accessToken` expired, `refreshToken` valid.
- **Action**: Middleware calls `authService.refreshToken`, sets new cookies, and proceeds with the original request.
- **Abuse Limit**: If the `REFRESH_TOKEN_LIMIT` (default 10) is reached, tokens are cleared and the user is logged out.

### Logout

- **Trigger**: `logout` mutation.
- **Cleanup**: `AuthInterceptor` detects the logout event, removes cookies, and clears Redis session cache.

---

## ⚙️ Configuration

Environment variables used for the Auth Plugin:

| Variable              | Description                             | Default     |
| :-------------------- | :-------------------------------------- | :---------- |
| `SECRET_KEY`          | Secret for signing JWTs.                | -           |
| `COOKIE_SECRET`       | Secret for signing HTTP-only cookies.   | -           |
| `OTP_TTL`             | Time-to-live for verification codes.    | `300s` (5m) |
| `ACCESS_TOKEN_TIME`   | `accessToken` expiration time.          | `1d`        |
| `REFRESH_TOKEN_TIME`  | `refreshToken` expiration time.         | `3d`        |
| `REFRESH_TOKEN_LIMIT` | Max rotations before re-login required. | `10`        |

---

## 📁 File Structure

- `strategies/`: Implementation of specific login methods (Phone, Email, Social, OTP).
- `services/`: Core logic for JWT generation, cookie management, and event handling.
- `guards/`: NestJS Guard and Interceptor for securing routes and hooking into mutations.
- `middleware/`: The bridge between browser cookies and Vendure's Bearer token auth.
