import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://dotwork.netlify.app",
  integrations: [mdx(), sitemap()],
  output: "hybrid",
  adapter: netlify(),
  image: {
    remotePatterns: [{ protocol: "https" }],
  },
});
