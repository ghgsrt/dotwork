import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import netlify from "@astrojs/netlify";
import { SITE_URL } from "./src/FriendlyConsts";
 
// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [mdx(), sitemap()],
  output: "server",
  adapter: netlify(),
  image: {
    remotePatterns: [{ protocol: "https" }],
  },
});
