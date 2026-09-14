import Hero from "@/components/secoes/Hero";
import QuemSomos from "@/components/secoes/QuemSomos";
import Servicos from "@/components/secoes/Servicos";
import Impactos from "@/components/secoes/Impactos";
import Destinacao from "@/components/secoes/Destinacao";
import QuemConfia from "@/components/secoes/QuemConfia";
import Projetos from "@/components/secoes/Projetos";
import Produtos from "@/components/secoes/Produtos";
import FunilVip from "@/components/secoes/FunilVip";
import Faq from "@/components/secoes/Faq";
import CtaFinal from "@/components/secoes/CtaFinal";

/**
 * Ordem da página: identidade, quem somos, o que fazemos, prova quantitativa,
 * o argumento técnico, prova social, casos, produtos, pedido, dúvidas, conversão.
 *
 * Prova antes do pedido: Impactos e Projetos vêm antes do funil de consultoria.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <QuemSomos />
      <Servicos />
      <Impactos />
      <Destinacao />
      <QuemConfia />
      <Projetos />
      <Produtos />
      <FunilVip />
      <Faq />
      <CtaFinal />
    </>
  );
}
