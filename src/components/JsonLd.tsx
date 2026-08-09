import { siteConfig, faqs } from "@/lib/data";

export default function JsonLd() {
  const baseUrl = "https://e-ventura.com";

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: siteConfig.name,
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shikhargarh",
      addressLocality: "Jodhpur",
      addressRegion: "Rajasthan",
      postalCode: "342001",
      addressCountry: "IN",
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.youtube,
      siteConfig.social.linkedin,
    ],
  };

  // LocalBusiness / EventPlanner Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "EventPlanner",
    "@id": `${baseUrl}/#localbusiness`,
    name: siteConfig.name,
    url: baseUrl,
    image: `${baseUrl}/images/hero-bg.png`,
    telephone: siteConfig.phone,
    priceRange: "₹₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shikhargarh",
      addressLocality: "Jodhpur",
      addressRegion: "Rajasthan",
      postalCode: "342001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.297,
      longitude: 73.024,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "19:00",
    },
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Jodhpur",
      },
      {
        "@type": "AdministrativeArea",
        name: "Rajasthan",
      },
      {
        "@type": "Country",
        name: "India",
      },
    ],
  };

  // Service Schemas
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Luxury Event Planning & Destination Wedding Planner",
    provider: {
      "@id": `${baseUrl}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Eventura Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Royal Destination Wedding Planning",
            description: "End-to-end luxury wedding management in palace venues across Rajasthan.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Corporate Event Management",
            description: "Conferences, galas, product launches, and brand activations.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Stage & Floral Decoration",
            description: "Bespoke stage designs, lighting rigs, and luxury floral decor.",
          },
        },
      ],
    },
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: "en-US",
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Plan Event",
        item: `${baseUrl}/planner/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
