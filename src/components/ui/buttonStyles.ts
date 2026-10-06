export function buttonClass(variant: "primary" | "secondary" | "ghost" | "whatsapp" | "paper", className = ""): string {
  const base =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-[12px] font-medium tracking-[0.14em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-white text-ink hover:bg-zinc-200",
    secondary: "border border-white/20 bg-transparent text-white hover:border-signal hover:bg-white/10",
    ghost: "min-h-11 px-0 text-white/80 underline-offset-4 hover:text-white hover:underline",
    whatsapp: "bg-[#075E54] text-white hover:bg-[#0a6b5f]",
    paper: "bg-ink text-white hover:bg-zinc-800",
  } as const;
  return `${base} ${variants[variant]} ${className}`.trim();
}
