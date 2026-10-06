import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <header className="max-w-3xl">
      <p className="text-[11px] font-medium tracking-[0.18em] text-signal uppercase">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-medium tracking-[-0.03em] text-white md:text-5xl">{title}</h1>
      <p className="mt-5 text-base leading-7 text-muted md:text-lg">{lede}</p>
    </header>
  );
}

export function PageMain({ children }: { children: ReactNode }) {
  return <main id="main" className="mx-auto w-full max-w-6xl px-4 pt-28 pb-20 md:px-8 md:pt-36 md:pb-28">{children}</main>;
}
