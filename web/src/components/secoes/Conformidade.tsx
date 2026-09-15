import FaixaSelos from "@/components/ui/FaixaSelos";

/**
 * Conformidade — compacta.
 *
 * Antes esta parte do site era um manual: explicava o que é MTR, para que serve
 * e qual portaria o instituiu. Agora cada item é escrito do ponto de vista do
 * que o cliente ganha, e o número do SINIR voltou a ser credencial, não manchete.
 */
export default function Conformidade() {
  return (
    <section id="conformidade" className="bg-creme py-20 md:py-28">
      <div className="shell">
        <FaixaSelos />
      </div>
    </section>
  );
}
