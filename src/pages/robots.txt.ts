import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const content = site
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", site)}\n`
    : "User-agent: *\nDisallow: /\n";

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
