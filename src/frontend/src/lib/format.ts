/**
 * Formatting helpers for VND prices, percentages, day counts and dates.
 * Backend timestamps are nanosecond bigints — always convert through
 * `timestampToDate` before touching a JavaScript `Date`.
 */

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

/** Format a whole-VND amount, e.g. 39000 -> "39.000 ₫". */
export function formatVnd(amount: number): string {
  if (!Number.isFinite(amount)) return "—";
  return VND.format(amount);
}

/** Format a 0–100 progress value as a percentage string. */
export function formatPercent(value: number | bigint): string {
  const numeric = typeof value === "bigint" ? Number(value) : value;
  if (!Number.isFinite(numeric)) return "—";
  return `${Math.round(numeric)}%`;
}

/** Clamp a progress value into the 0–100 range. */
export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** Format a day count, e.g. 5 -> "5 days". */
export function formatDays(days: number | bigint): string {
  const numeric = typeof days === "bigint" ? Number(days) : days;
  if (!Number.isFinite(numeric)) return "—";
  return `${numeric} ${numeric === 1 ? "day" : "days"}`;
}

/** Convert a Motoko nanosecond timestamp into a Date, or null when invalid. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a backend timestamp as a short locale date, with a fallback. */
export function formatDate(timestamp: bigint, locale = "en"): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Format a 1–5 rating as a compact label. */
export function formatRating(rating: number | bigint): string {
  const numeric = typeof rating === "bigint" ? Number(rating) : rating;
  if (!Number.isFinite(numeric)) return "—";
  return numeric.toFixed(1);
}
