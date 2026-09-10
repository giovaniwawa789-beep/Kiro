import Hero from "@/components/secoes/Hero";
import Metricas from "@/components/secoes/Metricas";
import Servicos from "@/components/secoes/Servicos";
import ComoTrabalhamos from "@/components/secoes/ComoTrabalhamos";
import Projetos from "@/components/secoes/Projetos";
import Produtos from "@/components/secoes/Produtos";
import ParaQuem from "@/components/secoes/ParaQuem";
import Depoimentos from "@/components/secoes/Depoimentos";
import Faq from "@/components/secoes/Faq";
import CtaFinal from "@/components/secoes/CtaFinal";

export default function Home() {
  return (
    <>
      <Hero />
      <Metricas />
      <Servicos />
      <ComoTrabalhamos />
      <Projetos />
      <Produtos />
      <ParaQuem />
      <Depoimentos />
      <Faq />
      <CtaFinal />
    </>
  );
}
