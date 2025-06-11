import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import Image from "next/image";

const config: DocsThemeConfig = {
  logo: (
    <div className="flex items-center gap-1">
      <Image
        src={"https://avatars.githubusercontent.com/u/119793569?s=200&v=4"}
        width={50}
        height={50}
        className="w-10 h-10"
        alt="Elysia Auth"
      />
      <span className="text-lg font-bold">Elysia Auth</span>
    </div>
  ),

  project: {
    link: "https://github.com/meabhisingh/elysia-auth.git",
  },
  chat: {
    link: "https://discord.com/invite/mhRB3wuS33  ",
  },
  docsRepositoryBase: "https://github.com/meabhisingh/elysia-auth#readme",
  footer: {
    component: null,
  },
  color: {
    hue: 340,
  },
};

export default config;
