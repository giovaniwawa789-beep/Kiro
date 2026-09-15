import { servicos } from "@/content/servicos";
import { linkWhatsApp } from "@/content/site";
import CardServico from "@/components/ui/CardServico";

/** Vitrine: o núcleo comercial do site. Um card por serviço. */
export default function Vitrine() {
  return (
    <section id="servicos" className="bg-branco py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="rotulo">Serviços</p>
            <h2 className="display mt-3 max-w-[22ch]">
              Como resolvemos o resíduo da sua operação
            </h2>
          </div>
          <a
            href={linkWhatsApp(
              "Olá! Quero falar com um especialista sobre resíduo têxtil.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="vitrine-especialista"
            className="pilula pilula-indigo"
          >
            Falar com um especialista
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((s) => (
            <li key={s.slug} className="flex">
              <CardServico servico={s} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
