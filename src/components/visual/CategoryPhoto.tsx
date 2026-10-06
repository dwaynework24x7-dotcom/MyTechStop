import { DeviceArt, artKindForCategory } from "@/components/visual/DeviceArt";

type Props = {
  src: string | null;
  alt: string;
  categoryId: string;
  className: string;
  fit?: "cover" | "contain";
};

export function CategoryPhoto({ src, alt, categoryId, className, fit = "cover" }: Props) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center text-white/75 ${className}`}>
        <DeviceArt kind={artKindForCategory(categoryId)} title={alt} className="h-[80%] w-auto" />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-black ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`} />
    </div>
  );
}
