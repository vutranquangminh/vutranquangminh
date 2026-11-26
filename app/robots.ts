import type { MetadataRoute } from "next";
import { profile } from "./data/profile";

// The private card path is deliberately not mentioned here: listing it would reveal it.
// It is kept out of search engines with noindex headers instead.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${profile.site}/sitemap.xml` };
}
