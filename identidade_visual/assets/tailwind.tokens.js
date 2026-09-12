/**
 * Nunes & Lucato · Gestão Ambiental — tokens para tailwind.config.js
 *
 * Uso:
 *   const nl = require("./identidade_visual/assets/tailwind.tokens.js");
 *   module.exports = { theme: { extend: nl.extend } };
 *
 * Carregue as fontes no <head> (SIL Open Font License):
 *   https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap
 */

const extend = {
  colors: {
    // Índigo — primária. 600 é a cor institucional.
    indigo: {
      900: "#0D0C24", // noite
      800: "#17165D", // profundo
      700: "#201F7A", // escuro
      600: "#2A28A0", // INSTITUCIONAL
      500: "#3432C9", // base / link / hover
      400: "#5C5ADB", // ativo
      200: "#C9C8F0", // névoa
      100: "#EEEEFB", // fundo
    },
    // Neutras
    grafite: "#383838", // EXCLUSIVO da logomarca — não usar em UI
    ink: { DEFAULT: "#14142E", soft: "#3A3C55" },
    grey: { DEFAULT: "#6E7288", light: "#9A9DB0" },
    rule: "#DFE2F0",
    tint: "#F4F5FC",
    // Acentos funcionais — só em dado, nunca em decoração
    cycle: { DEFAULT: "#12A87B", dark: "#0B7F5C" },
    aqua: "#1E86C9",
    // Representa "modelo linear". Âmbar está FORA da paleta (acento da Momo Ambiental).
    linear: "#8A8EA3",
  },

  fontFamily: {
    display: ['"Playfair Display"', "Georgia", "serif"],
    ui: ['"Montserrat"', "system-ui", "-apple-system", "sans-serif"],
    mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
  },

  fontSize: {
    // Títulos: sempre font-display
    h1: ["4.875rem", { lineHeight: "1.05", letterSpacing: "-0.018em", fontWeight: "800" }],
    h2: ["2.75rem", { lineHeight: "1.10", letterSpacing: "-0.010em", fontWeight: "600" }],
    // H3 e abaixo: font-ui
    h3: ["1.5rem", { lineHeight: "1.30", fontWeight: "600" }],
    body: ["1rem", { lineHeight: "1.62" }],
    label: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em", fontWeight: "600" }],
  },

  letterSpacing: {
    label: "0.18em", // rótulo caixa-alta
  },

  maxWidth: {
    container: "1280px",
    prose: "64ch",
  },

  borderRadius: {
    // O sistema é de cantos retos. Não introduzir raio sem revisar a identidade.
    none: "0px",
  },

  backgroundImage: {
    // Fundo institucional escuro: capa, hero, encerramento
    "nl-dark":
      "radial-gradient(120% 90% at 88% 12%, #3432C9 0%, rgba(52,50,201,0) 58%), " +
      "linear-gradient(103deg, #0D0C24 0%, #17165D 44%, #201F7A 72%, #2A28A0 100%)",
  },

  transitionDuration: {
    nl: "300ms", // padrão de cor/transform do sistema
  },
};

module.exports = { extend };
