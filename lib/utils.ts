// Format cents (integer) to display currency
export function formatCurrency(
  cents: number,
  currency: string = "USD"
): string {
  const value = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Mock exchange rates (Base USD) for automatic conversion demo
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  TRY: 32.50, // Approx as of demo creation
};

export function convertCurrency(cents: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return cents;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const centsInUsd = cents / fromRate;
  const convertedCents = Math.round(centsInUsd * toRate);
  
  return convertedCents;
}

// Format a compact version (e.g., $1.2K)
export function formatCompact(cents: number, currency: string = "USD"): string {
  const value = cents / 100;
  if (Math.abs(value) >= 1000) {
    return (
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value)
    );
  }
  return formatCurrency(cents, currency);
}

// Format date to readable string
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Format date to short month
export function formatMonth(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

// Calculate percentage change
export function percentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}

// Classify amount as positive/negative
export function amountClass(cents: number): string {
  if (cents > 0) return "text-positive";
  if (cents < 0) return "text-negative";
  return "";
}

// Generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
