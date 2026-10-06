/** Returns true only when LEAD_PRIORITY_QUANTITY is explicitly configured. */
export function markPriority(quantityText: string, thresholdValue: string | undefined): boolean {
  if (!thresholdValue?.trim()) return false;
  const threshold = Number(thresholdValue);
  if (!Number.isFinite(threshold) || threshold <= 0) return false;
  const match = quantityText.match(/\d+/);
  if (!match) return false;
  return Number(match[0]) >= threshold;
}

export function teamSummary(fields: Record<string, string>): string {
  return Object.entries(fields)
    .filter(([, value]) => value.trim().length > 0)
    .map(([key, value]) => `${labelFor(key)}: ${value.trim()}`)
    .join(". ");
}

function labelFor(key: string): string {
  const labels: Record<string, string> = {
    name: "Name",
    businessName: "Business",
    email: "Email",
    whatsapp: "WhatsApp",
    country: "Country",
    city: "City",
    location: "Location",
    devices: "Devices",
    model: "Model",
    storage: "Storage",
    color: "Color",
    carrier: "Carrier",
    lockStatus: "Lock",
    usage: "Usage",
    condition: "Condition",
    activation: "Activation",
    grade: "Grade",
    quantity: "Quantity",
    desiredPrice: "Desired price",
    notes: "Notes",
    resale: "Resale",
    cadence: "Cadence",
    language: "Language",
    upload: "Inventory file",
  };
  return labels[key] ?? key;
}
