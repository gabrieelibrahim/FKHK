import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/auth/", "/events/create/"],
    },
    sitemap: `${site}/sitemap.xml`,
  };
}
