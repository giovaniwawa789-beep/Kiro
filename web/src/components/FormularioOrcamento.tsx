"use client";

import { useId, useRef, useState } from "react";
import {
  enviarOrcamento,
  validarOrcamento,
  tiposResiduo,
  volumesMensais,
  type DadosOrcamento,
  type Erros,
} from "@/lib/enviarContato";
import { linkWhatsApp } from "@/content/site";

/**
 * Formulário de orçamento: curto de propósito. Cada campo extra derruba a
 * conversão, então só entra o que qualifica a proposta.
 *
 * Anti-spam sem CAPTCHA: campo-armadilha escondido de gente e tempo mínimo de
 * preenchimento. CAPTCHA custa conversão e acessibilidade; para volume de
 * formulário B2B, essas duas barreiras resolvem.
 */

const vazio = (): DadosOrcamento => ({
  nome: "",
  empresa: "",
  email: "",
  telefone: "",
  tipoResiduo: "",
  volumeMensal: "",
  cidade: "",
  mensagem: "",
  isca: "",
  aberto: Date.now(),
});

const campo =
  "w-full rounded-xl border bg-branco px-4 py-3.5 text-[15px] text-tinta " +
  "outline-none transition-colors duration-300 placeholder:text-suave focus:border-indigo";

export default function FormularioOrcamento() {
  const id = useId();
  const [dados, setDados] = useState<DadosOrcamento>(vazio);
  const [erros, setErros] = useState<Erros>({});
  const [estado, setEstado] = useState<"parado" | "enviando" | "ok" | "erro">(
    "parado",
  );
  const [mensagemErro, setMensagemErro] = useState("");
  const refPrimeiroErro = useRef<HTMLParagraphElement>(null);

  const definir = <K extends keyof DadosOrcamento>(k: K, v: string) => {
    setDados((d) => ({ ...d, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
  };

  async function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault();

    const encontrados = validarOrcamento(dados);
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      setEstado("erro");
      setMensagemErro("Confira os campos destacados.");
      // leva o foco para a mensagem, senão quem usa leitor de tela não percebe
      requestAnimationFrame(() => refPrimeiroErro.current?.focus());
      return;
    }

    setEstado("enviando");
    const r = await enviarOrcamento(dados);

    if (r.ok) {
      setEstado("ok");
      setDados(vazio());
    } else {
      setEstado("erro");
      setMensagemErro(r.erro);
    }
  }

  if (estado === "ok") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-indigo/25 bg-indigo-nevoa p-8 text-center"
      >
        <div
          aria-hidden
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo text-branco"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M3 8.5 6 11.5 13 4.5" />
          </svg>
        </div>
        <h3 className="mt-5 text-[21px]">Pedido preparado</h3>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-corpo">
          Abrimos seu programa de e-mail com o pedido preenchido. Respondemos em
          até um dia útil. Se nada abriu, fale com a gente pelo WhatsApp.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="pos-envio-whatsapp"
            className="pilula pilula-indigo"
          >
            Falar no WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setEstado("parado")}
            className="pilula pilula-vazada"
          >
            Enviar outro pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={aoEnviar}
      noValidate
      className="rounded-2xl border border-regua-2 bg-branco p-7 md:p-9"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Campo
          id={`${id}-nome`}
          rotulo="Nome"
          valor={dados.nome}
          erro={erros.nome}
          autoComplete="name"
          aoMudar={(v) => definir("nome", v)}
        />
        <Campo
          id={`${id}-empresa`}
          rotulo="Empresa"
          valor={dados.empresa}
          erro={erros.empresa}
          autoComplete="organization"
          aoMudar={(v) => definir("empresa", v)}
        />
        <Campo
          id={`${id}-email`}
          rotulo="E-mail corporativo"
          tipo="email"
          valor={dados.email}
          erro={erros.email}
          autoComplete="email"
          aoMudar={(v) => definir("email", v)}
        />
        <Campo
          id={`${id}-tel`}
          rotulo="Telefone"
          tipo="tel"
          valor={dados.telefone}
          erro={erros.telefone}
          autoComplete="tel"
          espaco="(11) 90000-0000"
          aoMudar={(v) => definir("telefone", v)}
        />

        <Selecao
          id={`${id}-tipo`}
          rotulo="Tipo de resíduo"
          valor={dados.tipoResiduo}
          erro={erros.tipoResiduo}
          opcoes={[...tiposResiduo]}
          aoMudar={(v) => definir("tipoResiduo", v)}
        />
        <Selecao
          id={`${id}-volume`}
          rotulo="Volume mensal estimado"
          valor={dados.volumeMensal}
          erro={erros.volumeMensal}
          opcoes={[...volumesMensais]}
          aoMudar={(v) => definir("volumeMensal", v)}
        />

        <div className="sm:col-span-2">
          <Campo
            id={`${id}-cidade`}
            rotulo="Cidade da unidade"
            valor={dados.cidade}
            erro={erros.cidade}
            autoComplete="address-level2"
            espaco="São Paulo"
            aoMudar={(v) => definir("cidade", v)}
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor={`${id}-msg`}
          className="mb-2 block text-[13px] font-semibold text-tinta"
        >
          Observações{" "}
          <span className="font-normal text-suave">(opcional)</span>
        </label>
        <textarea
          id={`${id}-msg`}
          rows={4}
          value={dados.mensagem}
          onChange={(e) => definir("mensagem", e.target.value)}
          placeholder="Frequência de coleta desejada, prazos, exigências de auditoria."
          className={`${campo} resize-y border-regua-2`}
        />
      </div>

      {/* armadilha anti-spam: fora da tela e fora da ordem de tabulação */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${id}-isca`}>Não preencha este campo</label>
        <input
          id={`${id}-isca`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={dados.isca}
          onChange={(e) => definir("isca", e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={estado === "enviando"}
        data-cta="form-orcamento"
        className="pilula pilula-indigo mt-8 w-full disabled:opacity-60 sm:w-auto"
      >
        {estado === "enviando" ? "Enviando…" : "Solicitar orçamento"}
      </button>

      <p
        ref={refPrimeiroErro}
        tabIndex={-1}
        aria-live="polite"
        role="status"
        className="mt-4 min-h-[20px] text-[13px] outline-none"
      >
        {estado === "erro" ? (
          <span className="font-semibold text-red-700">{mensagemErro}</span>
        ) : null}
      </p>

      <p className="mt-2 text-[12.5px] leading-relaxed text-suave">
        Usamos os dados apenas para responder ao seu pedido, conforme a LGPD.
      </p>
    </form>
  );
}

/* ------------------------------ campos ------------------------------ */

function Campo({
  id,
  rotulo,
  valor,
  erro,
  aoMudar,
  tipo = "text",
  autoComplete,
  espaco,
}: {
  id: string;
  rotulo: string;
  valor: string;
  erro?: string;
  aoMudar: (v: string) => void;
  tipo?: string;
  autoComplete?: string;
  espaco?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[13px] font-semibold text-tinta"
      >
        {rotulo} <span className="text-suave">*</span>
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        autoComplete={autoComplete}
        placeholder={espaco}
        onChange={(e) => aoMudar(e.target.value)}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`${campo} ${erro ? "border-red-600" : "border-regua-2"}`}
      />
      {erro ? (
        <p id={`${id}-erro`} className="mt-2 text-[13px] font-medium text-red-700">
          {erro}
        </p>
      ) : null}
    </div>
  );
}

function Selecao({
  id,
  rotulo,
  valor,
  erro,
  opcoes,
  aoMudar,
}: {
  id: string;
  rotulo: string;
  valor: string;
  erro?: string;
  opcoes: string[];
  aoMudar: (v: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[13px] font-semibold text-tinta"
      >
        {rotulo} <span className="text-suave">*</span>
      </label>
      <select
        id={id}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`${campo} ${erro ? "border-red-600" : "border-regua-2"}`}
      >
        <option value="">Selecione…</option>
        {opcoes.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {erro ? (
        <p id={`${id}-erro`} className="mt-2 text-[13px] font-medium text-red-700">
          {erro}
        </p>
      ) : null}
    </div>
  );
}
