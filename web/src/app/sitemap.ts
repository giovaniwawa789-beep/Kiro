import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { servicos } from "@/content/servicos";

/** Necessário para o `output: "export"` gerar o arquivo em build. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  return [
    { url: site.url, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    {
      url: `${site.url}/sobre`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${site.url}/contato`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    ...servicos.map((s) => ({
      url: `${site.url}/servicos/${s.slug}`,
      lastModified: agora,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
