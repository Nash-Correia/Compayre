export const MILLION = 1_000_000;
export const BILLION = 1_000_000_000;

const formatWithUnit = (value: number, unitDivisor: number, suffix: string) => {
  const result = value / unitDivisor;
  return `₹${result.toFixed(1)}${suffix}`;
};

export const formatCurrencyCompact = (value: number): string => {
  if (!Number.isFinite(value) || value === 0) {
    return "₹0.0M";
  }

  const absolute = Math.abs(value);
  const prefix = value < 0 ? "-" : "";

  if (absolute >= BILLION) {
    return `${prefix}${formatWithUnit(absolute, BILLION, "B")}`;
  }

  return `${prefix}${formatWithUnit(absolute, MILLION, "M")}`;
};

export const formatCurrencyAxisTick = (value: number): string => {
  if (!Number.isFinite(value) || value === 0) {
    return "₹0.0M";
  }

  const absolute = Math.abs(value);
  const prefix = value < 0 ? "-" : "";

  if (absolute >= BILLION) {
    return `${prefix}${formatWithUnit(absolute, BILLION, "B")}`;
  }

  return `${prefix}${formatWithUnit(absolute, MILLION, "M")}`;
};

export const formatCurrencyRaw = (value: number): string => {
  if (!Number.isFinite(value) || value === 0) {
    return "₹0.0M";
  }
  return formatCurrencyCompact(value);
};
