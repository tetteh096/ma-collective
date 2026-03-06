/**
 * Currency helpers — formats prices in Ghana Cedis (GHS)
 * EverShop stores prices in USD; we show them converted/formatted as GHS.
 *
 * For a real implementation you'd fetch a live exchange rate.
 * For now we use a fixed rate that can be overridden by env var.
 */

const USD_TO_GHS_RATE = parseFloat(process.env.NEXT_PUBLIC_USD_TO_GHS_RATE || '15.5');

/**
 * Format a USD price value to GHS display string
 * e.g. 10.00 → "GH₵ 155.00"
 */
export function formatGHS(usdValue: number): string {
  const ghsValue = usdValue * USD_TO_GHS_RATE;
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
  }).format(ghsValue);
}

/**
 * Format an already-GHS number (if EverShop is configured with GHS)
 */
export function formatGHSRaw(ghsValue: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
  }).format(ghsValue);
}

/** Given an EverShop price text (e.g. "$10.00") return the numeric USD value */
export function parseUSDText(text: string): number {
  return parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
}
