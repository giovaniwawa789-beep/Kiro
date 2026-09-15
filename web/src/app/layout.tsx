import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { servicos } from "@/content/servicos";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BotaoWhatsApp from "@/components/BotaoWhatsApp";
import Rastreio from "@/components/Rastreio";

/* Montserrat é a fonte institucional dos materiais da Nunes e Lucato. */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Nunes e Lucato | Logística reversa e reciclagem de resíduo têxtil",
    template: "%s | Nunes e Lucato",
  },
  description:
    "Coleta e destinação de resíduo têxtil para indústrias, marcas e grandes bases de uniforme. O material volta ao mercado como matéria-prima ou produto, com MTR e certificado de destinação.",
  keywords: [
    "logística reversa de resíduo têxtil",
    "reciclagem de resíduo têxtil",
    "descarte de uniformes",
    "destinação de resíduo têxtil São Paulo",
    "coleta de resíduo têxtil industrial",
    "upcycling têxtil corporativo",
  ],
  authors: [{ name: site.nomeCompleto }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.nomeCompleto,
    title: "Seu resíduo têxtil não precisa terminar em aterro",
    description:
      "Coletamos o resíduo da sua produção, uniformes e estoque, devolvemos o material ao mercado e entregamos a documentação que sua auditoria pede.",
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon_32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/favicon_180.png", sizes: "180x180" }],
  },
};

/** JSON-LD: LocalBusiness + catálogo de Service. */
function DadosEstruturados() {
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organizacao`,
        name: site.nomeCompleto,
        legalName: site.razaoSocial,
        url: site.url,
        description: site.descricao,
        taxID: site.contato.cnpj,
        email: site.contato.email,
        areaServed: { "@type": "State", name: "São Paulo" },
        knowsAbout: [
          "logística reversa de resíduo têxtil",
          "reciclagem de resíduo têxtil",
          "descarte de uniformes",
          "destinação de resíduo têxtil",
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${site.url}/#empresa`,
        name: site.nomeCompleto,
        legalName: site.razaoSocial,
        description: site.descricao,
        url: site.url,
        telephone: site.contato.telefone,
        email: site.contato.email,
        taxID: site.contato.cnpj,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.contato.endereco,
          addressLocality: site.contato.cidade,
          addressRegion: site.contato.uf,
          postalCode: site.contato.cep,
          addressCountry: "BR",
        },
        areaServed: {
          "@type": "State",
          name: "São Paulo",
        },
      },
      ...servicos.map((s) => ({
        "@type": "Service",
        "@id": `${site.url}/servicos/${s.slug}#servico`,
        name: s.titulo,
        description: s.beneficio,
        url: `${site.url}/servicos/${s.slug}`,
        serviceType: s.titulo,
        provider: { "@id": `${site.url}/#empresa` },
        areaServed: { "@type": "State", name: "São Paulo" },
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON gerado a partir de conteúdo próprio, sem entrada de usuário
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body className="antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-indigo focus:px-5 focus:py-3 focus:text-[14px] focus:font-semibold focus:text-white"
        >
          Ir para o conteúdo
        </a>

        <Navbar />
        <main id="conteudo">{children}</main>
        <Footer />
        <BotaoWhatsApp />
        <Rastreio />
        <DadosEstruturados />
      </body>
    </html>
  );
}
