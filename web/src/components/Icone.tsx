import type { IconeServico } from "@/content/servicos";

/**
 * Ícones em traço fino, desenhados para o projeto.
 * Herdam a cor do texto (`currentColor`) para acender no hover do card.
 */
const caminhos: Record<IconeServico, React.ReactNode> = {
  // prancheta com selo de conformidade
  consultoria: (
    <>
      <path d="M17 6h3v15H4V6h3" />
      <path d="M8 4h8v4H8z" />
      <path d="M8 13h5M8 17h8" />
      <circle cx="17" cy="13" r="2.4" />
    </>
  ),
  // ciclo fechado
  reciclagem: (
    <>
      <path d="M12 5a7 7 0 0 1 6.3 10" />
      <path d="M12 19a7 7 0 0 1-6.3-10" />
      <path d="M16.6 13.6 18.8 16l-3.2 1" />
      <path d="M7.4 10.4 5.2 8l3.2-1" />
    </>
  ),
  // documento assinado
  documento: (
    <>
      <path d="M14 3H6v18h12V7z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  // caminhão de coleta
  coleta: (
    <>
      <path d="M2 8h10v8H2z" />
      <path d="M12 11h4l4 3.5V16h-8z" />
      <circle cx="6" cy="18" r="1.9" />
      <circle cx="16.5" cy="18" r="1.9" />
    </>
  ),
  // camiseta descaracterizada
  uniforme: (
    <>
      <path d="M9 4l1.8 1.8h2.4L15 4l4.6 3.2-2.2 3.6-1.4-1.2V20H8V9.6L6.6 10.8 4.4 7.2z" />
      <path d="M6 18.5 18 6.5" />
    </>
  ),
  // bolsa / produto
  produto: (
    <>
      <path d="M5 8h14l-1.2 12H6.2z" />
      <path d="M9 8V6.2a3 3 0 0 1 6 0V8" />
      <path d="M9.5 13h5" />
    </>
  ),
};

export default function Icone({
  nome,
  className,
}: {
  nome: IconeServico;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {caminhos[nome]}
    </svg>
  );
}
