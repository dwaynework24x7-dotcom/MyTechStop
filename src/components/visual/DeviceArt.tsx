type Props = {
  kind: "phone" | "tablet" | "laptop" | "watch" | "inventory" | "shipment" | "inspection";
  className?: string;
  title?: string;
};

export function DeviceArt({ kind, className, title }: Props) {
  const labelled = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };
  return (
    <svg viewBox="0 0 240 320" className={className} fill="none" {...labelled}>
      {kind === "phone" ? <Phone /> : null}
      {kind === "tablet" ? <Tablet /> : null}
      {kind === "laptop" ? <Laptop /> : null}
      {kind === "watch" ? <Watch /> : null}
      {kind === "inventory" ? <Inventory /> : null}
      {kind === "shipment" ? <Shipment /> : null}
      {kind === "inspection" ? <Inspection /> : null}
    </svg>
  );
}

function Phone() {
  return (
    <g stroke="currentColor" strokeWidth="1.6">
      <rect x="74" y="24" width="92" height="272" rx="22" fill="currentColor" fillOpacity="0.06" />
      <rect x="86" y="48" width="68" height="196" rx="4" strokeOpacity="0.35" />
      <rect x="104" y="36" width="32" height="7" rx="3.5" fill="currentColor" />
      <circle cx="120" cy="268" r="5" />
    </g>
  );
}

function Tablet() {
  return (
    <g stroke="currentColor" strokeWidth="1.4">
      <rect x="48" y="46" width="144" height="210" rx="16" />
      <circle cx="120" cy="236" r="3.5" />
      <path d="M70 86h100M70 102h72" opacity="0.45" />
    </g>
  );
}

function Laptop() {
  return (
    <g stroke="currentColor" strokeWidth="1.4">
      <rect x="46" y="58" width="148" height="98" rx="8" />
      <path d="M28 168h184l-16 22H44l-16-22Z" />
      <path d="M104 168h32" opacity="0.5" />
    </g>
  );
}

function Watch() {
  return (
    <g stroke="currentColor" strokeWidth="1.4">
      <rect x="96" y="36" width="48" height="42" rx="10" />
      <rect x="78" y="72" width="84" height="104" rx="28" />
      <rect x="96" y="176" width="48" height="42" rx="10" />
      <circle cx="120" cy="124" r="22" />
    </g>
  );
}

function Inventory() {
  return (
    <g stroke="currentColor" strokeWidth="1.4">
      <rect x="46" y="78" width="148" height="36" rx="6" />
      <rect x="58" y="126" width="124" height="36" rx="6" />
      <rect x="70" y="174" width="100" height="36" rx="6" />
    </g>
  );
}

function Shipment() {
  return (
    <g stroke="currentColor" strokeWidth="1.4">
      <path d="M48 196V108h92l36 36v52H48Z" />
      <path d="M140 108v36h36" />
      <path d="M70 150h48M70 168h32" opacity="0.55" />
    </g>
  );
}

function Inspection() {
  return (
    <g stroke="currentColor" strokeWidth="1.4">
      <rect x="70" y="64" width="72" height="150" rx="14" />
      <circle cx="154" cy="176" r="28" />
      <path d="M174 196l22 22" />
    </g>
  );
}

export function artKindForCategory(id: string): Props["kind"] {
  if (id === "ipad") return "tablet";
  if (id === "macbook") return "laptop";
  if (id === "apple-watch") return "watch";
  return "phone";
}
