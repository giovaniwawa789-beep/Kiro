import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Necessário para o `output: "export"` gerar o arquivo em build. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
