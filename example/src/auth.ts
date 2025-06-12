import { AuthError, AuthOptions } from "elysia-auth";
import Credentials from "elysia-auth/providers/credentials";
import Github from "elysia-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async ({ email, password }) => {
        if (typeof email !== "string")
          throw new AuthError("Invalid Email or Password");
        if (typeof password !== "string")
          throw new AuthError("Invalid password");

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) throw new AuthError("Invalid Email or Password");

        if (!user.password) throw new AuthError("Invalid Email or Password");

        const isValid = await Bun.password.verify(password, user.password);

        if (!isValid) throw new AuthError("Invalid Email or Password");

        return {
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    Github,
  ],
};
