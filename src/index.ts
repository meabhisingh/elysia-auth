import { Auth } from "@auth/core";
import { Elysia } from "elysia";
import Credentials from "@auth/core/providers/credentials";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import { AuthOptions } from "./types";

const defaultAuthOptions: AuthOptions = {
  providers: [
    Google({
      clientId: Bun.env.AUTH_GOOGLE_ID,
      clientSecret: Bun.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: Bun.env.AUTH_GITHUB_ID!,
      clientSecret: Bun.env.AUTH_GITHUB_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
    }),
  ],
  trustHost: true,
  secret: Bun.env.AUTH_SECRET,
  session: { strategy: "jwt" },

  // Add this config if you are using backend and frontend cross origin

  // add redirect in callback, where the baseUrl will be backend url and url will be the callbackUrl (in this case it should be frontend Url)
  // callbacks: {
  //   redirect: async ({ baseUrl, url }) => {
  //     if (url.startsWith("http")) return url;

  //     // Allows relative callback URLs
  //     if (url.startsWith("/")) return `${baseUrl}${url}`;

  //     // Allows callback URLs on the same origin
  //     if (new URL(url).origin === baseUrl) return url;

  //     return baseUrl;
  //   },
  // },

  // add custom signin & error page redirecting frontend
  // pages: {
  //   signIn: "http://localhost:5173/signin",
  //   error: "http://localhost:5173?error=Auth+Error",
  // },
};

export * from "./middlewares";
export * from "./types";
export * from "./errors";

export const ElysiaAuth = (options: Partial<AuthOptions> = {}) => {
  const mergedOptions: AuthOptions = {
    ...defaultAuthOptions,
    ...options,
  };

  return new Elysia().mount((request) => Auth(request, mergedOptions));
};
