import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import Image from "next/image";

const config: DocsThemeConfig = {
  logo: (
    <div className="flex items-center gap-1">
      <Image
        src={
          "https://camo.githubusercontent.com/243909f00e726430f4d7e31c0f5e5c87e3abde526714482c806445852907d319/68747470733a2f2f6e6578742d617574682e6a732e6f72672f696d672f6c6f676f2f6c6f676f2d736d2e706e67"
        }
        width={50}
        height={50}
        className="w-10 h-10"
        alt="Auth"
      />
      <span className="text-lg font-bold">Auth.js</span>
    </div>
  ),

  project: {
    link: "https://github.com/meabhisingh/@auth/elysia.git",
  },
  chat: {
    link: "https://discord.com/invite/mhRB3wuS33  ",
  },
  docsRepositoryBase: "https://github.com/meabhisingh/@auth/elysia#readme",
  footer: {
    component: null,
  },
  color: {
    hue: 340,
  },
};

export default config;
