import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://myreliq.com"; // Replace with actual domain

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/dashboard/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
