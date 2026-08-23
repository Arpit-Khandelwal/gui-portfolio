import { availability, faqs, profile, selectedWork, skills } from "@/components/portfolio/data";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, absoluteUrl } from "@/lib/site";
import type { Post } from "@/lib/writing/posts";

/**
 * JSON-LD identity graph for the homepage.
 *
 * One `@graph` with stable `@id`s so the entities cross-reference instead of
 * repeating themselves: a Person (the identity), a ProfessionalService (the
 * business, carrying contactPoint and address), the WebSite, the ProfilePage,
 * and the FAQ.
 */

const PERSON_ID = `${SITE_URL}/#person`;
const ORGANISATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const address = {
  "@type": "PostalAddress",
  addressLocality: "Bengaluru",
  addressRegion: "Karnataka",
  addressCountry: "IN",
} as const;

const contactPoint = {
  "@type": "ContactPoint",
  contactType: "sales",
  email: profile.email,
  url: absoluteUrl("/contact"),
  availableLanguage: ["English", "Hindi"],
  areaServed: "Worldwide",
  hoursAvailable: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "10:00",
    closes: "19:00",
  },
} as const;

export function buildHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: profile.name,
        jobTitle: "Fractional AI & Backend Engineer",
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        email: `mailto:${profile.email}`,
        image: profile.avatar,
        address,
        contactPoint,
        knowsAbout: skills.map((skill) => skill.name),
        sameAs: [profile.github, profile.x, profile.linkedin, profile.resume],
        worksFor: { "@id": ORGANISATION_ID },
      },
      {
        "@type": "ProfessionalService",
        "@id": ORGANISATION_ID,
        name: SITE_NAME,
        legalName: profile.name,
        description:
          "Fixed-scope AI and backend build sprints of 2-6 weeks for founders and small product teams: AI agents, MCP servers, browser automation, APIs, and integrations.",
        url: SITE_URL,
        email: profile.email,
        image: profile.avatar,
        logo: absoluteUrl("/icon.svg"),
        founder: { "@id": PERSON_ID },
        address,
        contactPoint,
        areaServed: "Worldwide",
        priceRange: "Fixed price per sprint",
        sameAs: [profile.github, profile.x, profile.linkedin],
        knowsAbout: skills.map((skill) => skill.name),
        makesOffer: {
          "@type": "Offer",
          name: "Fractional build sprint",
          description: `${availability.status}. ${availability.reply}.`,
          availability: "https://schema.org/InStock",
          url: absoluteUrl("/contact"),
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Shipped work",
          itemListElement: selectedWork.map((item) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "CreativeWork",
              name: item.title,
              description: item.shipped,
              url: item.href,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: SITE_TITLE,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": PERSON_ID },
        primaryImageOfPage: absoluteUrl("/opengraph-image"),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "WebAPI",
        "@id": `${SITE_URL}/#api`,
        name: `${SITE_NAME} Public Agent API`,
        description:
          "Public, unauthenticated JSON API exposing profile, services, work history, availability, and sprint-brief submission.",
        url: absoluteUrl("/docs"),
        documentation: absoluteUrl("/docs"),
        provider: { "@id": ORGANISATION_ID },
        termsOfService: absoluteUrl("/privacy-policy"),
        potentialAction: {
          "@type": "ConsumeAction",
          target: absoluteUrl("/openapi.json"),
        },
      },
    ],
  };
}

/**
 * `Article` JSON-LD for one post. Author and publisher reference the `@id`s
 * declared by the homepage graph rather than restating the identity, so an
 * agent resolves a post back to the same entity.
 */
export function buildArticleJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(post.path)}#article`,
    headline: post.title,
    description: post.description,
    url: absoluteUrl(post.path),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en",
    keywords: [...post.tags],
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORGANISATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(post.path) },
  };
}
