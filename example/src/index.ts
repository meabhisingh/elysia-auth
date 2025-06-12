import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { ElysiaAuth } from "elysia-auth";
import { authOptions } from "./auth";
import { prisma } from "./lib/prisma";
import { httpError, httpErrorDecorator } from "elysia-http-error";

const signupModule = new Elysia().use(httpErrorDecorator).post(
  "/api/v1/signup",
  async ({ body, redirect, HttpError }) => {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (user) throw HttpError.BadRequest("User already Exist");

    const hashedPassword = await Bun.password.hash(body.password);

    const imageExt = body.file.name.split(".").pop();
    const imageName = `${crypto.randomUUID()}.${imageExt}`;

    await Bun.write(`./uploads/${imageName}`, await body.file.arrayBuffer());

    await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        image: `/uploads/${imageName}`,
      },
    });

    return redirect("/auth/signin");
  },
  {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 6 }),
      file: t.File({ type: "image" }),
    }),
  }
);

const app = new Elysia()
  .use(httpError())
  .use(staticPlugin())
  .use(
    staticPlugin({
      assets: "./uploads",
      prefix: "/uploads",
    })
  )
  .use(ElysiaAuth(authOptions))
  .get("/", () => Bun.file("public/index.html"))
  .get("/signup", Bun.file("public/signup/index.html"))
  .use(signupModule)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
