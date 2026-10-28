import { defineConfig } from "astro/config";
import markdoc from "@astrojs/markdoc";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

const publicSiteUrl = process.env.PUBLIC_SITE_URL?.trim();

export default defineConfig({
  site: publicSiteUrl || undefined,
  integrations: [
    react(),
    markdoc(),
    ...(process.env.SKIP_KEYSTATIC === "true" ? [] : [keystatic()]),
  ],
});

