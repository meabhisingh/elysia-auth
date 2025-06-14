import { decode } from "@auth/core/jwt";
import { bearer } from "@elysiajs/bearer";
import { Elysia } from "elysia";
import { AuthUser, MiddlewareOptions } from "./types";

const defaultAuthOptions: MiddlewareOptions<AuthUser> = {
  // Options with defaults
  unauthorizedStatus: 401,
  unauthorizedMessage: "Unauthorized: Authentication required",

  // Function to verify if a request is authenticated
  // You can customize this to check JWT, session cookies, etc.
  isAuthenticated: async ({ salt, secret, token }) => {
    // Default implementation checks for Authorization header
    try {
      if (!token) return null;
      const user = await decode({
        token,
        salt,
        secret,
      });

      return user || null;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  },

  // Function to extract user data if needed
  getUserData: async (authUser) => authUser,

  // Optional onFailure handler
  onFailure: null,
};

/**
 * Creates a route-specific authentication middleware for Elysia
 *
 * This middleware factory creates an Elysia plugin that validates bearer tokens
 * or session cookies for authenticated access. It checks tokens against a secret,
 * decodes user data, and handles unauthorized access.
 *
 * Features:
 * - Bearer token and cookie-based auth support
 * - Customizable unauthorized responses
 * - Optional user data retrieval
 * - Configurable failure handling
 *
 * @example
 * // Protect specific routes
 * app
 *   .group('/admin', app => app
 *     .use(authGuard({
 *       secret: 'your-secret',
 *       unauthorizedMessage: 'Please login first'
 *     }))
 *     .get('/dashboard', () => 'Admin Dashboard')
 *   )
 *
 * @param options - Configuration options for authentication behavior
 * @returns An Elysia plugin that adds authentication to route groups
 */
const authGuard = <T = AuthUser>(
  options: Partial<MiddlewareOptions<T>> = {}
) => {
  const config = { ...defaultAuthOptions, ...options } as MiddlewareOptions<T>;

  return new Elysia({ name: "elysia-auth-guard" })
    .use(bearer())
    .derive(async (ctx) => {
      const salt = Bun.env.AUTH_SALT || config.salt || "authjs.session-token";
      const secret = Bun.env.AUTH_SECRET || config.secret!;
      const token = ctx.bearer || ctx.cookie[salt]?.value;

      // Verify authentication
      const userJwt = await config.isAuthenticated({
        salt,
        secret,
        token,
      });

      let userData: T | null = null;
      if (userJwt && config.getUserData) {
        userData = await config.getUserData(userJwt);
      }

      return {
        session: {
          user: userData,
          authUser: userJwt!,
          isAuthenticated: Boolean(userJwt),
        },
      };
    })
    .onBeforeHandle(({ session, set }) => {
      if (!session.isAuthenticated) {
        if (config.onFailure) {
          return config.onFailure(set);
        }

        set.status = config.unauthorizedStatus;
        return {
          success: false,
          message: config.unauthorizedMessage,
        };
      }
    })
    .get("/get-session", (ctx) => ctx.session)
    .as("scoped");
};

/**
 * Creates a global path-based authentication middleware for Elysia
 *
 * This middleware protects specified URL paths by validating authentication
 * for any request matching those paths. It supports both exact path matches
 * and path prefixes, making it ideal for protecting entire sections of your API.
 *
 * Features:
 * - Protect multiple paths with a single middleware
 * - Support for path prefixes (e.g., '/api/' protects all paths starting with /api/)
 * - Bearer token and cookie-based authentication
 * - Skips authentication for non-protected paths
 * - Configurable authentication behavior
 *
 * @example
 * // Protect multiple paths globally
 * app.use(protectPaths(
 *   ['/admin', '/api/private', '/dashboard'],
 *   {
 *     secret: 'your-secret',
 *     unauthorizedStatus: 403
 *   }
 * ))
 *
 * @param protectedPaths - Array of URL paths to protect
 * @param options - Configuration options for authentication behavior
 * @returns An Elysia plugin that adds global path-based authentication
 */
const protectPaths = <UserData = AuthUser>(
  protectedPaths: string[],
  options: Partial<MiddlewareOptions<UserData>> = {}
) => {
  const config = { ...defaultAuthOptions, ...options };

  return new Elysia({ name: "elysia-path-auth" })
    .use(bearer())
    .derive(async (ctx) => {
      const pathname = new URL(ctx.request.url).pathname;
      const isProtectedPath = protectedPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
      );

      // Skip authentication for non-protected paths
      if (!isProtectedPath) {
        return {
          isProtectedPath: false,
          user: null,
          isAuthenticated: false,
        };
      }

      const salt = Bun.env.AUTH_SALT || config.salt || "authjs.session-token";
      const secret = Bun.env.AUTH_SECRET || config.secret!;
      const token = ctx.bearer || ctx.cookie[salt]?.value;

      // Verify authentication for protected paths
      const userJwt = await config.isAuthenticated({
        salt,
        secret,
        token,
      });

      const session = {
        user:
          userJwt && config.getUserData
            ? await config.getUserData(userJwt!)
            : null,
        authUser: userJwt!,
        isAuthenticated: Boolean(userJwt),
      };

      return {
        isProtectedPath,
        session,
      };
    })
    .onBeforeHandle(({ isProtectedPath, session, set }) => {
      // Only check auth for protected paths
      if (isProtectedPath && !session.isAuthenticated) {
        if (config.onFailure) {
          return config.onFailure(set);
        }

        set.status = config.unauthorizedStatus;
        return {
          success: false,
          message: config.unauthorizedMessage,
        };
      }
    })
    .get("/get-session", (ctx) => ctx.session)
    .as("global");
};

export { authGuard, protectPaths };
