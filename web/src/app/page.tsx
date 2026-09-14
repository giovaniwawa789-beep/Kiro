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

/* As seções são import estático: o HTML delas (números, casos, formulário)
   precisa vir na resposta para SEO e para funcionar sem JS. O three.js fica
   isolado dentro de Monta3D, que só baixa a biblioteca perto da viewport. */
import MuroCredibilidade from "@/components/secoes/MuroCredibilidade";
import FunilVip from "@/components/secoes/FunilVip";

export default function Home() {
  return (
    <>
      <Hero />
      <Metricas />
      <Servicos />
      <ComoTrabalhamos />
      {/* prova antes do pedido: credibilidade, depois a consultoria */}
      <MuroCredibilidade />
      <Projetos />
      <Produtos />
      <FunilVip />
      <ParaQuem />
      <Depoimentos />
      <Faq />
      <CtaFinal />
    </>
  );
}
