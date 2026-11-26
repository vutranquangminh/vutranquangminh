import type { MetadataRoute } from "next";
import { profile } from "./data/profile";

// /card is kept out of search engines with noindex headers rather than a Disallow rule,
// because crawlers must be able to fetch it to see the noindex.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${profile.site}/sitemap.xml` };
}
