"use client";

import { useId, useState } from "react";
import { servicos } from "@/content/servicos";
import {
  enviarContato,
  validarContato,
  type DadosContato,
  type ErrosContato,
} from "@/lib/enviarContato";

const VAZIO: DadosContato = {
  nome: "",
  empresa: "",
  email: "",
  telefone: "",
  tipoServico: servicos[0].titulo,
  mensagem: "",
};

const campoBase =
  "w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-ink " +
  "placeholder:text-body/80 transition-colors duration-300 outline-none " +
  "focus:border-accent";

export default function FormularioContato() {
  const id = useId();
  const [dados, setDados] = useState<DadosContato>(VAZIO);
  const [erros, setErros] = useState<ErrosContato>({});
  const [estado, setEstado] = useState<"parado" | "enviando" | "ok" | "erro">(
    "parado",
  );
  const [mensagemErro, setMensagemErro] = useState("");

  function alterar<K extends keyof DadosContato>(campo: K, valor: string) {
    setDados((d) => ({ ...d, [campo]: valor }));
    // limpa o erro do campo assim que o usuário corrige
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  async function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault();

    const encontrados = validarContato(dados);
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      setEstado("erro");
      setMensagemErro("Confira os campos destacados.");
      return;
    }

    setEstado("enviando");
    const resultado = await enviarContato(dados);

    if (resultado.ok) {
      setEstado("ok");
      setDados(VAZIO);
    } else {
      setEstado("erro");
      setMensagemErro(resultado.erro);
    }
  }

  if (estado === "ok") {
    return (
      <div
        role="status"
        className="glass rounded-2xl border-primary/40 p-8 text-center"
      >
        <div
          aria-hidden
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M3 8.5 6 11.5 13 4.5" />
          </svg>
        </div>
        <h2 className="mt-5 text-[21px]">Mensagem preparada</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-body">
          Abrimos o seu programa de e-mail com a solicitação preenchida. Se nada
          abriu, fale com a gente pelo WhatsApp — respondemos por lá também.
        </p>
        <button
          type="button"
          onClick={() => setEstado("parado")}
          className="mt-7 rounded-full border border-white/20 px-6 py-3 text-[14px] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={aoEnviar} noValidate className="glass rounded-2xl p-7 md:p-9">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Campo
          id={`${id}-nome`}
          rotulo="Nome"
          valor={dados.nome}
          erro={erros.nome}
          autoComplete="name"
          aoAlterar={(v) => alterar("nome", v)}
          obrigatorio
        />
        <Campo
          id={`${id}-empresa`}
          rotulo="Empresa"
          valor={dados.empresa}
          erro={erros.empresa}
          autoComplete="organization"
          aoAlterar={(v) => alterar("empresa", v)}
          obrigatorio
        />
        <Campo
          id={`${id}-email`}
          rotulo="E-mail"
          tipo="email"
          valor={dados.email}
          erro={erros.email}
          autoComplete="email"
          aoAlterar={(v) => alterar("email", v)}
          obrigatorio
        />
        <Campo
          id={`${id}-telefone`}
          rotulo="Telefone"
          tipo="tel"
          valor={dados.telefone}
          erro={erros.telefone}
          autoComplete="tel"
          espaco="(11) 90000-0000"
          aoAlterar={(v) => alterar("telefone", v)}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor={`${id}-servico`}
          className="mb-2 block text-[13px] font-medium text-ink"
        >
          Tipo de serviço
        </label>
        <select
          id={`${id}-servico`}
          value={dados.tipoServico}
          onChange={(e) => alterar("tipoServico", e.target.value)}
          className={`${campoBase} border-white/12 appearance-none`}
        >
          {servicos.map((s) => (
            <option key={s.slug} value={s.titulo} className="bg-surface">
              {s.titulo}
            </option>
          ))}
          <option value="Não sei / preciso de orientação" className="bg-surface">
            Não sei / preciso de orientação
          </option>
        </select>
      </div>

      <div className="mt-5">
        <label
          htmlFor={`${id}-mensagem`}
          className="mb-2 block text-[13px] font-medium text-ink"
        >
          Mensagem <span className="text-body">*</span>
        </label>
        <textarea
          id={`${id}-mensagem`}
          rows={5}
          value={dados.mensagem}
          onChange={(e) => alterar("mensagem", e.target.value)}
          placeholder="Conte o volume aproximado, o tipo de resíduo e a cidade da unidade."
          aria-invalid={Boolean(erros.mensagem)}
          aria-describedby={erros.mensagem ? `${id}-mensagem-erro` : undefined}
          className={`${campoBase} resize-y ${
            erros.mensagem ? "border-red-400/70" : "border-white/12"
          }`}
        />
        {erros.mensagem ? (
          <p
            id={`${id}-mensagem-erro`}
            className="mt-2 text-[13px] text-red-300"
          >
            {erros.mensagem}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="mt-8 w-full rounded-full bg-primary px-7 py-4 text-[15px] font-semibold text-[#04120b] transition-colors duration-300 hover:bg-accent disabled:opacity-60 sm:w-auto"
      >
        {estado === "enviando" ? "Enviando…" : "Enviar mensagem"}
      </button>

      <p aria-live="polite" role="status" className="mt-4 min-h-[20px] text-[13px]">
        {estado === "erro" ? (
          <span className="text-red-300">{mensagemErro}</span>
        ) : null}
      </p>

      <p className="mt-2 text-[12.5px] leading-relaxed text-body">
        Ao enviar, você concorda que usemos os dados informados apenas para
        responder ao seu contato, conforme a LGPD.
      </p>
    </form>
  );
}

function Campo({
  id,
  rotulo,
  valor,
  erro,
  aoAlterar,
  tipo = "text",
  autoComplete,
  espaco,
  obrigatorio,
}: {
  id: string;
  rotulo: string;
  valor: string;
  erro?: string;
  aoAlterar: (v: string) => void;
  tipo?: string;
  autoComplete?: string;
  espaco?: string;
  obrigatorio?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-ink">
        {rotulo} {obrigatorio ? <span className="text-body">*</span> : null}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        autoComplete={autoComplete}
        placeholder={espaco}
        onChange={(e) => aoAlterar(e.target.value)}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`${campoBase} ${erro ? "border-red-400/70" : "border-white/12"}`}
      />
      {erro ? (
        <p id={`${id}-erro`} className="mt-2 text-[13px] text-red-300">
          {erro}
        </p>
      ) : null}
    </div>
  );
}
