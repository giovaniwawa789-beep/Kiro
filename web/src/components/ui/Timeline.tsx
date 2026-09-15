import type { Marco } from "@/content/sobre";
import Pendente from "./Pendente";

/**
 * Linha do tempo da empresa.
 *
 * Marco sem ano aparece com o marcador no lugar da data: a trajetória fica
 * visível na estrutura, e o que falta preencher fica óbvio.
 */
export default function Timeline({ marcos }: { marcos: Marco[] }) {
  return (
    <ol className="relative">
      {/* eixo vertical */}
      <span
        aria-hidden
        className="absolute left-[7px] top-2 bottom-2 w-px bg-regua md:left-[calc(7rem+7px)]"
      />

      {marcos.map((m) => (
        <li
          key={m.titulo}
          className="relative flex flex-col gap-2 pb-10 pl-8 last:pb-0 md:flex-row md:gap-8 md:pl-0"
        >
          {/* ano */}
          <div className="md:w-28 md:flex-none md:pr-8 md:text-right">
            {m.ano ? (
              <span className="font-display text-[19px] font-extrabold tabular-nums text-indigo">
                {m.ano}
              </span>
            ) : (
              <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-amber-700">
                ano?
              </span>
            )}
          </div>

          {/* marcador no eixo */}
          <span
            aria-hidden
            className={`absolute left-0 top-2 z-10 h-[15px] w-[15px] rounded-full border-2 bg-branco md:left-[7rem] ${
              m.confirmado ? "border-indigo" : "border-amber-500"
            }`}
          />

          <div className="md:flex-1 md:pl-8">
            <h3 className="text-[17px] leading-snug">{m.titulo}</h3>
            {m.descricao.includes("{{PREENCHER}}") ? (
              <p className="mt-2">
                <Pendente titulo="Marco">
                  {m.descricao.replace("{{PREENCHER}} — ", "")}
                </Pendente>
              </p>
            ) : (
              <p className="mt-2 max-w-[52ch] text-[14.5px] leading-relaxed text-corpo">
                {m.descricao}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
