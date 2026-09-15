import Hero from "@/components/secoes/Hero";
import FaixaCredibilidade from "@/components/secoes/FaixaCredibilidade";
import Vitrine from "@/components/secoes/Vitrine";
import Destinos from "@/components/secoes/Destinos";
import ComoFunciona from "@/components/secoes/ComoFunciona";
import Impactos from "@/components/secoes/Impactos";
import Cases from "@/components/secoes/Cases";
import Segmentos from "@/components/secoes/Segmentos";
import Conformidade from "@/components/secoes/Conformidade";
import CtaFinal from "@/components/secoes/CtaFinal";

/**
 * Ordem da home, conforme o briefing:
 * dor → prova social → vitrine → destino do material → processo → números →
 * cases → segmentos → conformidade compacta → conversão.
 *
 * A lógica: o visitante entende o que vendemos antes de qualquer explicação
 * técnica, e a conformidade entra no fim como reforço de compra, não como aula.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <FaixaCredibilidade />
      <Vitrine />
      <Destinos />
      <ComoFunciona />
      <Impactos />
      <Cases />
      <Segmentos />
      <Conformidade />
      <CtaFinal />
    </>
  );
}
