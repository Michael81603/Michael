import type { APIRoute } from "astro";
import { getPublishedProjects } from "../lib/content";

export const prerender = true;

const escapeXml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

export const GET: APIRoute = async ({ site }) => {
  const projects = await getPublishedProjects();
  const paths = ["/", ...projects.map(({ id }) => `/projets/${id}/`)];
  const urls = site
    ? paths.map((path) => `  <url><loc>${escapeXml(new URL(path, site).toString())}</loc></url>`).join("\n")
    : "  <!-- PUBLIC_SITE_URL doit être renseignée avant la mise en ligne. -->";
  const content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(content, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
