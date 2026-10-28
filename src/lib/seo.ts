export const siteIdentity = {
  name: "RAKOTOMALALA Fenotiana Michael",
  profession: "Développeur full-stack web et mobile",
  email: "fenotianamichael81@gmail.com",
  github: "https://github.com/Michael81603",
  language: "fr-FR",
  socialImage: "/images/social/portfolio-social.jpg",
  socialImageAlt: "Fenotiana Michael, développeur full-stack web et mobile",
};

export function absoluteUrl(path: string, site?: URL): string | undefined {
  if (/^https?:\/\//.test(path)) return path;
  return site ? new URL(path, site).toString() : undefined;
}

export function serializeJsonLd(value: Record<string, unknown> | Record<string, unknown>[]) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function buildHomeJsonLd(site?: URL) {
  const homeUrl = absoluteUrl("/", site);
  const personId = homeUrl ? `${homeUrl}#person` : undefined;
  const image = absoluteUrl(siteIdentity.socialImage, site);

  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      ...(personId && { "@id": personId }),
      name: siteIdentity.name,
      jobTitle: siteIdentity.profession,
      email: `mailto:${siteIdentity.email}`,
      sameAs: [siteIdentity.github],
      ...(homeUrl && { url: homeUrl }),
      ...(image && { image }),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: `Portfolio de ${siteIdentity.name}`,
      inLanguage: siteIdentity.language,
      ...(homeUrl && { url: homeUrl }),
      ...(personId && { author: { "@id": personId } }),
    },
  ];
}

type ProjectStructuredData = {
  title: string;
  summary: string;
  path: string;
  image: string;
  technologies: string[];
};

export function buildProjectJsonLd(project: ProjectStructuredData, site?: URL) {
  const projectUrl = absoluteUrl(project.path, site);
  const image = absoluteUrl(project.image, site);
  const personUrl = absoluteUrl("/#person", site);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    inLanguage: siteIdentity.language,
    ...(projectUrl && { url: projectUrl }),
    ...(image && { image }),
    ...(personUrl
      ? { author: { "@type": "Person", "@id": personUrl, name: siteIdentity.name } }
      : { author: { "@type": "Person", name: siteIdentity.name } }),
    ...(project.technologies.length > 0 && { keywords: project.technologies }),
  };
}
