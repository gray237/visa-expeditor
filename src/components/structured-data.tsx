import { localePath, SITE_URL } from "@/lib/seo";

function jsonLd(data: object) {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

export function SiteStructuredData({ locale }: { locale: string }) {
  const organizationId = `${SITE_URL}/#organization`;
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Visa Expeditor",
    url: SITE_URL,
    inLanguage: locale,
    publisher: { "@id": organizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}${localePath(locale, "/tools/visa-checker")}?to={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: "Visa Expeditor",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(website) }}
      />
    </>
  );
}
