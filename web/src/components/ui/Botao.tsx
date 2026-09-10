import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

type Variante = "primario" | "secundario" | "fantasma";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[background-color,border-color,color,transform] duration-300 " +
  "ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] " +
  "text-[15px] leading-none whitespace-nowrap";

const variantes: Record<Variante, string> = {
  primario:
    "bg-primary text-[#04120b] px-7 py-4 font-semibold hover:bg-accent",
  secundario:
    "border border-white/20 text-ink px-7 py-4 hover:border-accent hover:text-accent",
  fantasma: "text-ink px-4 py-2 hover:text-accent",
};

interface Props {
  href: string;
  children: ReactNode;
  variante?: Variante;
  className?: string;
  /** Links externos abrem em nova aba com rel de segurança. */
  externo?: boolean;
  "aria-label"?: string;
}

export default function Botao({
  href,
  children,
  variante = "primario",
  className,
  externo,
  ...resto
}: Props) {
  const classe = clsx(base, variantes[variante], className);

  if (externo) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classe}
        {...resto}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classe} {...resto}>
      {children}
    </Link>
  );
}
