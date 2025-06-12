import { Auth } from "@auth/core";
import { Context } from "elysia";

export type AuthOptions = Parameters<typeof Auth>[1];

export type AuthUser = {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  sub?: string;
  iat?: number;
  exp?: number;
  jti?: string;
};

// Define the authentication options type
export type MiddlewareOptions<T = AuthUser> = {
  /**
   * HTTP status code for unauthorized responses
   * @default 401
   */
  unauthorizedStatus: number;

  /**
   * Message to return for unauthorized requests
   * @default "Unauthorized: Authentication required"
   */
  unauthorizedMessage: string;

  /**
   * Optional custom salt for token verification
   */
  salt?: string;

  /**
   * Optional custom secret for token verification
   */
  secret?: string;

  /**
   * Authentication verification function
   * Returns the decoded JWT if authenticated, null otherwise
   */
  isAuthenticated: (args: {
    salt: string;
    secret: string;
    token?: string;
  }) => Promise<AuthUser | null>;

  /**
   * Function to retrieve user data from email
   */
  getUserData?: (authUser: AuthUser) => Promise<T>;

  /**
   * Optional custom handler for authentication failures
   */
  onFailure?: ((set: Context["set"]) => unknown) | null;
};
