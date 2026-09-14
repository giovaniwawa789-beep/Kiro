"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { site, linkWhatsApp } from "@/content/site";
import {
  tiposOperacao,
  faixasVolume,
  situacoesDocumentais,
  urgencias,
  horarios,
  proximosDiasUteis,
  type OpcaoCampo,
} from "@/content/funil";
import { revelar, noViewport } from "@/lib/motion";
import { TituloSecao } from "@/components/ui/Secao";
import Monta3D from "@/components/webgl3d/Monta3D";

/**
 * Funil VIP de duas etapas.
 *
 * Semântica: um único <form>, cada etapa é um <fieldset> com <legend>, cada
 * grupo de escolhas é um <fieldset> com radios nativos. Radio nativo dá
 * navegação por setas, rótulo clicável e leitura correta de "3 de 4" no leitor
 * de tela — coisas que uma <div role="radio"> só imita.
 *
 * Acessibilidade da troca de etapa: o título da etapa recebe foco e a mudança é
 * anunciada por região aria-live. Sem isso, quem usa leitor de tela clica em
 * "continuar" e não sabe que a tela mudou.
 */

type Estado = "etapa1" | "etapa2" | "enviado";

interface Dados {
  tipoOperacao: string;
  volume: string;
  situacao: string;
  urgencia: string;
  data: string;
  horario: string;
  nome: string;
  empresa: string;
  email: string;
  whatsapp: string;
}

const VAZIO: Dados = {
  tipoOperacao: "",
  volume: "",
  situacao: "",
  urgencia: "",
  data: "",
  horario: "",
  nome: "",
  empresa: "",
  email: "",
  whatsapp: "",
};

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FunilVip() {
  const id = useId();
  const [estado, setEstado] = useState<Estado>("etapa1");
  const [dados, setDados] = useState<Dados>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<keyof Dados, string>>>({});
  const [dias, setDias] = useState<ReturnType<typeof proximosDiasUteis>>([]);
  const refTitulo = useRef<HTMLHeadingElement>(null);
  const refPrimeiraEtapa = useRef(true);

  /* A agenda depende da data de hoje: calcular no servidor divergiria da
     hidratação. Por isso só depois de montar. */
  useEffect(() => {
    setDias(proximosDiasUteis(6));
  }, []);

  /* Move o foco para o título ao trocar de etapa, exceto na carga inicial. */
  useEffect(() => {
    if (refPrimeiraEtapa.current) {
      refPrimeiraEtapa.current = false;
      return;
    }
    refTitulo.current?.focus();
  }, [estado]);

  const definir = <K extends keyof Dados>(campo: K, valor: string) => {
    setDados((d) => ({ ...d, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  };

  const avancar = () => {
    const novos: Partial<Record<keyof Dados, string>> = {};
    if (!dados.tipoOperacao) novos.tipoOperacao = "Selecione o tipo de operação.";
    if (!dados.volume) novos.volume = "Selecione o volume aproximado.";
    if (!dados.urgencia) novos.urgencia = "Selecione a situação atual.";

    if (Object.keys(novos).length) {
      setErros(novos);
      return;
    }
    setEstado("etapa2");
  };

  const enviar = (evento: React.FormEvent) => {
    evento.preventDefault();

    const novos: Partial<Record<keyof Dados, string>> = {};
    if (!dados.data) novos.data = "Escolha um dia.";
    if (!dados.horario) novos.horario = "Escolha um horário.";
    if (dados.nome.trim().length < 2) novos.nome = "Informe o seu nome.";
    if (dados.empresa.trim().length < 2) novos.empresa = "Informe a empresa.";
    if (!RE_EMAIL.test(dados.email.trim())) novos.email = "E-mail inválido.";

    if (Object.keys(novos).length) {
      setErros(novos);
      return;
    }

    const rotulo = (lista: OpcaoCampo[], v: string) =>
      lista.find((o) => o.valor === v)?.rotulo ?? v;

    const dia = dias.find((d) => d.iso === dados.data);

    const corpo = [
      "CONSULTORIA VIP — solicitação pelo site",
      "",
      `Empresa: ${dados.empresa}`,
      `Contato: ${dados.nome}`,
      `E-mail: ${dados.email}`,
      `WhatsApp: ${dados.whatsapp || "não informado"}`,
      "",
      "— Qualificação —",
      `Operação: ${rotulo(tiposOperacao, dados.tipoOperacao)}`,
      `Volume: ${rotulo(faixasVolume, dados.volume)}`,
      `Situação documental: ${rotulo(situacoesDocumentais, dados.situacao) || "não informada"}`,
      `Urgência: ${rotulo(urgencias, dados.urgencia)}`,
      "",
      "— Agendamento pretendido —",
      `Dia: ${dia ? `${dia.diaSemana} ${dia.dia}/${dia.mes}` : dados.data}`,
      `Horário: ${dados.horario}`,
    ].join("\n");

    // Mesma abstração do formulário simples: trocar por endpoint quando houver.
    window.location.href =
      `mailto:${site.contato.email}` +
      `?subject=${encodeURIComponent(`Consultoria VIP — ${dados.empresa}`)}` +
      `&body=${encodeURIComponent(corpo)}`;

    setEstado("enviado");
  };

  const etapaAtual = estado === "etapa1" ? 1 : 2;

  return (
    <section
      id="consultoria"
      className="relative isolate overflow-hidden border-y border-white/8 py-24 md:py-32"
    >
      {/* fluido reage ao ponteiro; three só entra perto da seção */}
      <Monta3D carregar={() => import("@/components/webgl3d/FluidoHover")} />
      <div className="noise" aria-hidden />

      <div className="shell relative">
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="max-w-3xl"
        >
          <TituloSecao
            rotulo="Consultoria VIP"
            titulo={
              <>
                Uma hora com quem assina{" "}
                <span className="text-primary">o laudo</span>
              </>
            }
            apoio="Diagnóstico conduzido pela responsável técnica, não por equipe comercial. Saímos da conversa com o seu enquadramento legal, o volume que está sendo perdido e o que dele volta como produto."
          />
        </motion.div>

        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16"
        >
          {/* ---------------- valor + prova ---------------- */}
          <div>
            <ol className="space-y-5">
              {[
                {
                  t: "Enquadramento legal, sem rodeio",
                  d: "O que a lei exige da sua operação hoje e onde você está exposto.",
                },
                {
                  t: "O custo que está saindo pela porta",
                  d: "Quanto material está sendo descartado e qual parte dele tem valor.",
                },
                {
                  t: "O caminho até o produto",
                  d: "Que peça o seu resíduo pode virar, com volumetria e prazo.",
                },
              ].map((item, i) => (
                <li key={item.t} className="flex gap-4">
                  <span
                    aria-hidden
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/15 font-mono text-[12px] text-primary"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[16px]">{item.t}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-body">
                      {item.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="glass mt-8 rounded-2xl p-6">
              <p className="text-[14px] leading-relaxed text-body">
                Conduzido por{" "}
                <span className="text-ink">{site.contato.responsavel}</span>,
                responsável técnica e sócia. Cadastro no SINIR{" "}
                <span className="font-mono text-ink">{site.contato.sinir}</span>{" "}
                como {site.contato.perfilMtr}.
              </p>
            </div>

            <p className="mt-6 text-[13.5px] text-body">
              Prefere conversar agora?{" "}
              <a
                href={linkWhatsApp(
                  "Olá! Quero agendar a consultoria VIP de resíduos têxteis.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-accent"
              >
                Fale pelo WhatsApp
              </a>
            </p>
          </div>

          {/* ---------------- formulário ---------------- */}
          <div className="glass rounded-2xl p-7 md:p-9">
            {estado === "enviado" ? (
              <div role="status">
                <div
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary"
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
                <h3 className="mt-5 text-[22px]">Solicitação preparada</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-body">
                  Abrimos o seu programa de e-mail com a qualificação e o horário
                  escolhido. Confirmamos a agenda em até um dia útil. Se nada
                  abriu, chame no WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDados(VAZIO);
                    setEstado("etapa1");
                  }}
                  className="mt-7 rounded-full border border-white/20 px-6 py-3 text-[14px] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  Nova solicitação
                </button>
              </div>
            ) : (
              <form onSubmit={enviar} noValidate>
                {/* progresso */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Etapa {etapaAtual} de 2
                    </p>
                    <p className="text-[12px] text-body">
                      {etapaAtual === 1 ? "Qualificação" : "Agendamento"}
                    </p>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={etapaAtual}
                    aria-valuemin={1}
                    aria-valuemax={2}
                    aria-label="Progresso do agendamento"
                    className="mt-3 h-px w-full bg-white/12"
                  >
                    <div
                      className="h-full bg-primary transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ width: `${etapaAtual * 50}%` }}
                    />
                  </div>
                </div>

                {/* anúncio da troca de etapa para leitor de tela */}
                <p aria-live="polite" className="sr-only">
                  {etapaAtual === 1
                    ? "Etapa 1 de 2: qualificação"
                    : "Etapa 2 de 2: agendamento"}
                </p>

                {estado === "etapa1" ? (
                  <fieldset>
                    <legend className="sr-only">Qualificação da operação</legend>
                    <h3
                      ref={refTitulo}
                      tabIndex={-1}
                      className="text-[20px] outline-none"
                    >
                      Sobre a sua operação
                    </h3>

                    <GrupoRadio
                      nome={`${id}-tipo`}
                      titulo="Tipo de operação"
                      opcoes={tiposOperacao}
                      valor={dados.tipoOperacao}
                      erro={erros.tipoOperacao}
                      aoMudar={(v) => definir("tipoOperacao", v)}
                      colunas={2}
                    />

                    <GrupoRadio
                      nome={`${id}-volume`}
                      titulo="Volume de resíduo têxtil"
                      opcoes={faixasVolume}
                      valor={dados.volume}
                      erro={erros.volume}
                      aoMudar={(v) => definir("volume", v)}
                      colunas={2}
                    />

                    <GrupoRadio
                      nome={`${id}-situacao`}
                      titulo="Situação documental (opcional)"
                      opcoes={situacoesDocumentais}
                      valor={dados.situacao}
                      aoMudar={(v) => definir("situacao", v)}
                      colunas={2}
                    />

                    <GrupoRadio
                      nome={`${id}-urgencia`}
                      titulo="Situação atual"
                      opcoes={urgencias}
                      valor={dados.urgencia}
                      erro={erros.urgencia}
                      aoMudar={(v) => definir("urgencia", v)}
                      colunas={1}
                    />

                    <button
                      type="button"
                      onClick={avancar}
                      className="mt-8 w-full rounded-full bg-primary px-7 py-4 text-[15px] font-semibold text-[#04120b] transition-colors duration-300 hover:bg-accent sm:w-auto"
                    >
                      Continuar para a agenda
                    </button>
                  </fieldset>
                ) : (
                  <fieldset>
                    <legend className="sr-only">Agendamento e contato</legend>
                    <h3
                      ref={refTitulo}
                      tabIndex={-1}
                      className="text-[20px] outline-none"
                    >
                      Escolha o melhor horário
                    </h3>

                    {/* ----- dia ----- */}
                    <fieldset className="mt-7">
                      <legend className="mb-3 block text-[13px] font-medium text-ink">
                        Dia <span className="text-body">*</span>
                      </legend>
                      {dias.length === 0 ? (
                        <p className="text-[13px] text-body">Carregando agenda…</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                          {dias.map((d) => (
                            <label
                              key={d.iso}
                              className={`cursor-pointer rounded-xl border px-2 py-3 text-center transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                                dados.data === d.iso
                                  ? "border-accent bg-accent/10"
                                  : "border-white/12 hover:border-white/30"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`${id}-data`}
                                value={d.iso}
                                checked={dados.data === d.iso}
                                onChange={() => definir("data", d.iso)}
                                className="sr-only"
                              />
                              <span className="block text-[11px] uppercase text-body">
                                {d.diaSemana.replace(".", "")}
                              </span>
                              <span className="mt-0.5 block font-display text-[17px] font-semibold text-ink">
                                {d.dia}
                              </span>
                              <span className="block text-[10.5px] text-body">
                                {d.mes.replace(".", "")}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                      {erros.data ? (
                        <p className="mt-2 text-[13px] text-red-300">{erros.data}</p>
                      ) : null}
                    </fieldset>

                    {/* ----- horário ----- */}
                    <fieldset className="mt-6">
                      <legend className="mb-3 block text-[13px] font-medium text-ink">
                        Horário <span className="text-body">*</span>
                      </legend>
                      <div className="flex flex-wrap gap-2.5">
                        {horarios.map((h) => (
                          <label
                            key={h.valor}
                            className={`cursor-pointer rounded-full border px-5 py-2.5 text-[14px] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                              dados.horario === h.valor
                                ? "border-accent bg-accent/10 text-ink"
                                : "border-white/12 text-body hover:border-white/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`${id}-horario`}
                              value={h.valor}
                              checked={dados.horario === h.valor}
                              onChange={() => definir("horario", h.valor)}
                              className="sr-only"
                            />
                            {h.rotulo}
                          </label>
                        ))}
                      </div>
                      {erros.horario ? (
                        <p className="mt-2 text-[13px] text-red-300">
                          {erros.horario}
                        </p>
                      ) : null}
                    </fieldset>

                    {/* ----- contato ----- */}
                    <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Campo
                        id={`${id}-nome`}
                        rotulo="Nome"
                        valor={dados.nome}
                        erro={erros.nome}
                        autoComplete="name"
                        aoMudar={(v) => definir("nome", v)}
                        obrigatorio
                      />
                      <Campo
                        id={`${id}-empresa`}
                        rotulo="Empresa"
                        valor={dados.empresa}
                        erro={erros.empresa}
                        autoComplete="organization"
                        aoMudar={(v) => definir("empresa", v)}
                        obrigatorio
                      />
                      <Campo
                        id={`${id}-email`}
                        rotulo="E-mail corporativo"
                        tipo="email"
                        valor={dados.email}
                        erro={erros.email}
                        autoComplete="email"
                        aoMudar={(v) => definir("email", v)}
                        obrigatorio
                      />
                      <Campo
                        id={`${id}-whats`}
                        rotulo="WhatsApp"
                        tipo="tel"
                        valor={dados.whatsapp}
                        autoComplete="tel"
                        espaco="(11) 90000-0000"
                        aoMudar={(v) => definir("whatsapp", v)}
                      />
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setEstado("etapa1")}
                        className="rounded-full border border-white/20 px-6 py-4 text-[15px] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-full bg-primary px-7 py-4 text-[15px] font-semibold text-[#04120b] transition-colors duration-300 hover:bg-accent sm:flex-none"
                      >
                        Confirmar solicitação
                      </button>
                    </div>

                    <p className="mt-4 text-[12.5px] leading-relaxed text-body">
                      Confirmamos a agenda em até um dia útil. Usamos os dados
                      apenas para responder ao seu contato, conforme a LGPD.
                    </p>
                  </fieldset>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ======================= peças do formulário ======================= */

function GrupoRadio({
  nome,
  titulo,
  opcoes,
  valor,
  erro,
  aoMudar,
  colunas,
}: {
  nome: string;
  titulo: string;
  opcoes: OpcaoCampo[];
  valor: string;
  erro?: string;
  aoMudar: (v: string) => void;
  colunas: 1 | 2;
}) {
  return (
    <fieldset className="mt-7">
      <legend className="mb-3 block text-[13px] font-medium text-ink">
        {titulo}
      </legend>
      <div
        className={`grid gap-2.5 ${colunas === 2 ? "sm:grid-cols-2" : "grid-cols-1"}`}
      >
        {opcoes.map((o) => (
          <label
            key={o.valor}
            className={`cursor-pointer rounded-xl border px-4 py-3 transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
              valor === o.valor
                ? "border-accent bg-accent/10"
                : "border-white/12 hover:border-white/30"
            }`}
          >
            <input
              type="radio"
              name={nome}
              value={o.valor}
              checked={valor === o.valor}
              onChange={() => aoMudar(o.valor)}
              className="sr-only"
            />
            <span className="block text-[14px] text-ink">{o.rotulo}</span>
            {o.nota ? (
              <span className="mt-0.5 block text-[12px] text-body">{o.nota}</span>
            ) : null}
          </label>
        ))}
      </div>
      {erro ? <p className="mt-2 text-[13px] text-red-300">{erro}</p> : null}
    </fieldset>
  );
}

function Campo({
  id,
  rotulo,
  valor,
  erro,
  aoMudar,
  tipo = "text",
  autoComplete,
  espaco,
  obrigatorio,
}: {
  id: string;
  rotulo: string;
  valor: string;
  erro?: string;
  aoMudar: (v: string) => void;
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
        onChange={(e) => aoMudar(e.target.value)}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-ink outline-none transition-colors duration-300 placeholder:text-body/80 focus:border-accent ${
          erro ? "border-red-400/70" : "border-white/12"
        }`}
      />
      {erro ? (
        <p id={`${id}-erro`} className="mt-2 text-[13px] text-red-300">
          {erro}
        </p>
      ) : null}
    </div>
  );
}
