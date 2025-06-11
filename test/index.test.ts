import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { Elysia } from "elysia";
import { ElysiaAuth, authGuard, protectPaths } from "../src";
import { encode } from "@auth/core/jwt";

// Mock environment variables
beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret";
  process.env.AUTH_SALT = "test-salt";
});

describe("ElysiaAuth", () => {
  it("should create an instance with default options", () => {
    const auth = ElysiaAuth();
    expect(auth).toBeDefined();
    expect(auth).toBeInstanceOf(Elysia);
  });

  it("should merge custom options with defaults", () => {
    const auth = ElysiaAuth({
      secret: "custom-secret",
      trustHost: false,
    });
    expect(auth).toBeDefined();
  });
});

describe("Auth Guard Middleware", () => {
  let validToken: string;

  beforeEach(async () => {
    // Create a test token
    validToken = await encode({
      token: { sub: "test-user", email: "test@example.com" },
      secret: process.env.AUTH_SECRET!,
      salt: process.env.AUTH_SALT!,
    });

    const testApp = new Elysia()
      .use(
        authGuard({
          secret: process.env.AUTH_SECRET,
        })
      )
      .get("/protected", ({ session }) => ({
        success: true,
        user: session.user,
      }));

    // Test protected route with valid token
    const response = await testApp.handle(
      new Request("http://localhost/protected", {
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      })
    );
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // Test protected route without token
    const unauthorizedResponse = await testApp.handle(
      new Request("http://localhost/protected")
    );
    const unauthorizedData = await unauthorizedResponse.json();
    expect(unauthorizedResponse.status).toBe(401);
    expect(unauthorizedData.success).toBe(false);

    // Test protected route with invalid token
    const invalidResponse = await testApp.handle(
      new Request("http://localhost/protected", {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      })
    );
    const invalidData = await invalidResponse.json();
    expect(invalidResponse.status).toBe(401);
    expect(invalidData.success).toBe(false);
  });
});

describe("Protected Paths Middleware", () => {
  let validToken: string;

  beforeEach(async () => {
    validToken = await encode({
      token: { sub: "test-user", email: "test@example.com" },
      secret: process.env.AUTH_SECRET!,
      salt: process.env.AUTH_SALT!,
    });

    const testApp = new Elysia()
      .use(
        protectPaths(["/admin", "/api/private"], {
          secret: process.env.AUTH_SECRET,
        })
      )
      .get("/admin/dashboard", () => ({ success: true }))
      .get("/api/private/data", () => ({ success: true }))
      .get("/public", () => ({ success: true }));

    // Test protected path
    const response = await testApp.handle(
      new Request("http://localhost/admin/dashboard")
    );
    expect(response.status).toBe(401);

    // Test protected path with valid token
    const authorizedResponse = await testApp.handle(
      new Request("http://localhost/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      })
    );
    const authorizedData = await authorizedResponse.json();
    expect(authorizedResponse.status).toBe(200);
    expect(authorizedData.success).toBe(true);

    // Test public path without token
    const publicResponse = await testApp.handle(
      new Request("http://localhost/public")
    );
    const publicData = await publicResponse.json();
    expect(publicResponse.status).toBe(200);
    expect(publicData.success).toBe(true);
  });
});

describe("Session Handling", () => {
  let validToken: string;

  beforeEach(async () => {
    validToken = await encode({
      token: { sub: "test-user", email: "test@example.com" },
      secret: process.env.AUTH_SECRET!,
      salt: process.env.AUTH_SALT!,
    });

    const testApp = new Elysia()
      .use(
        authGuard({
          secret: process.env.AUTH_SECRET,
          getUserData: async (authUser) => ({
            id: authUser.sub,
            email: authUser.email,
          }),
        })
      )
      .get("/me", ({ session }) => session);

    // Test session data
    const response = await testApp.handle(
      new Request("http://localhost/me", {
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      })
    );
    const data = await response.json();
    expect(data.user).toEqual({
      id: "test-user",
      email: "test@example.com",
    });
    expect(data.isAuthenticated).toBe(true);
  });
});

// Clean up
afterAll(() => {
  delete process.env.AUTH_SECRET;
  delete process.env.AUTH_SALT;
});
