import { linkWhatsApp } from "@/content/site";

/**
 * WhatsApp flutuante.
 *
 * Server component: nenhum JavaScript. `data-cta` marca o clique para o
 * rastreamento configurado em lib/rastreio.ts.
 */
export default function BotaoWhatsApp() {
  return (
    <a
      href={linkWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="whatsapp-flutuante"
      aria-label="Falar com a nossa equipe pelo WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-[#128C4A] px-5 py-3.5 text-[14px] font-bold text-white shadow-[0_10px_28px_rgba(18,140,74,0.34)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] md:bottom-7 md:right-7"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5 flex-none"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.1c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.02.07-1.76-.11-.44-.1-1.02-.3-1.76-.62-2.62-1.13-4.33-3.77-4.46-3.94-.13-.18-1.06-1.4-1.06-2.68 0-1.27.67-1.9.9-2.16.24-.26.53-.33.7-.33.18 0 .35 0 .5.01.16.01.38-.06.59.45.22.53.74 1.8.8 1.93.07.13.11.28.02.46-.09.18-.13.29-.27.44-.13.16-.28.35-.4.47-.13.13-.27.27-.11.53.15.26.68 1.13 1.47 1.83 1.01.9 1.86 1.18 2.12 1.31.27.13.42.11.58-.07.15-.18.67-.78.85-1.05.18-.27.35-.22.6-.13.24.09 1.51.71 1.77.84.26.13.44.2.5.31.07.11.07.64-.17 1.32Z" />
      </svg>
      <span className="hidden sm:inline">Falar no WhatsApp</span>
    </a>
  );
}
