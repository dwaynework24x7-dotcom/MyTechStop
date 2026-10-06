import { featuredMarkets } from "@/config/countries";
import type { Locale } from "@/config/locale";

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

/** Same equirectangular frame as public/maps/world.svg (Natural Earth land). */
function project(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * MAP_WIDTH,
    y: ((90 - lat) / 180) * MAP_HEIGHT,
  };
}

const labelOffset: Record<string, { dx: number; dy: number }> = {
  US: { dx: 0, dy: -22 },
  MX: { dx: -28, dy: 6 },
  PA: { dx: -26, dy: -10 },
  CO: { dx: 26, dy: 0 },
  PE: { dx: 24, dy: 8 },
  PY: { dx: 26, dy: 8 },
  SN: { dx: -26, dy: 0 },
  GH: { dx: 26, dy: 8 },
  AE: { dx: 0, dy: -22 },
  MN: { dx: 0, dy: -22 },
  HK: { dx: 28, dy: 8 },
};

export function InternationalMap({ locale, activeCode, label }: { locale: Locale; activeCode?: string; label: string }) {
  const points = featuredMarkets();

  return (
    <div>
      <div className="relative border border-white/10 bg-[#121418]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/maps/world.svg" alt="" className="block h-auto w-full" />
        <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          {[-60, -30, 0, 30, 60].map((lng) => {
            const x = ((lng + 180) / 360) * MAP_WIDTH;
            return <line key={`v-${lng}`} x1={x} y1={0} x2={x} y2={MAP_HEIGHT} stroke="#ffffff" strokeOpacity="0.08" />;
          })}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const y = ((90 - lat) / 180) * MAP_HEIGHT;
            return <line key={`h-${lat}`} x1={0} y1={y} x2={MAP_WIDTH} y2={y} stroke="#ffffff" strokeOpacity="0.08" />;
          })}
          {points.map((point) => {
            const { x, y } = project(point.lat, point.lng);
            const active = point.code === activeCode;
            const offset = labelOffset[point.code] ?? { dx: 0, dy: -14 };
            return (
              <g key={point.code}>
                <circle cx={x} cy={y} r={active ? 11 : 7} fill={active ? "#ffffff" : "#e8e8e8"} />
                {active ? <circle cx={x} cy={y} r={18} fill="none" stroke="#ffffff" strokeOpacity="0.75" /> : null}
                <text x={x + offset.dx} y={y + offset.dy} textAnchor="middle" fill="#ffffff" fontSize="22" fontFamily="ui-sans-serif, system-ui, sans-serif">
                  {point.code}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <ul aria-label={label} className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        {points.map((point) => {
          const active = point.code === activeCode;
          return (
            <li key={point.code} className={active ? "font-medium text-white" : "text-muted"}>
              {active ? <span aria-hidden="true">● </span> : <span aria-hidden="true">○ </span>}
              {point.name[locale]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
