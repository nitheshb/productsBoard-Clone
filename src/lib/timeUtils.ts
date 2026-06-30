// Time tracking utilities. Canonical unit is INTEGER minutes.
// Workday convention: 1d = 8h (standard agile sizing).

export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 8;
export const MINUTES_PER_DAY = MINUTES_PER_HOUR * HOURS_PER_DAY;

// Accept natural unit variants so users can type "1 hr", "30 min", "2 hours", "1 day", etc.
const UNIT_TO_KIND: Record<string, 'd' | 'h' | 'm'> = {
  d: 'd', day: 'd', days: 'd',
  h: 'h', hr: 'h', hrs: 'h', hour: 'h', hours: 'h',
  m: 'm', min: 'm', mins: 'm', minute: 'm', minutes: 'm',
};
const UNIT_PATTERN = Object.keys(UNIT_TO_KIND)
  .sort((a, b) => b.length - a.length)
  .join('|');
const TOKEN_RE = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${UNIT_PATTERN})\\b`, 'gi');

/**
 * Parse a duration string into minutes. Accepts forms like:
 *   "30m", "30 min", "30 minutes", "1h", "1 hr", "2 hours",
 *   "2.5h", "1d", "1 day", "1d 2h 30m".
 * Whitespace and capitalization are flexible. Returns null on invalid/empty input.
 */
export function parseDuration(input: string): number | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  let total = 0;
  let matched = false;
  const consumed: Array<[number, number]> = [];

  for (const match of trimmed.matchAll(TOKEN_RE)) {
    matched = true;
    const value = parseFloat(match[1]);
    if (!isFinite(value) || value < 0) return null;
    const kind = UNIT_TO_KIND[match[2].toLowerCase()];
    if (kind === 'd') total += value * MINUTES_PER_DAY;
    else if (kind === 'h') total += value * MINUTES_PER_HOUR;
    else total += value;
    consumed.push([match.index ?? 0, (match.index ?? 0) + match[0].length]);
  }

  if (!matched) return null;

  // Reject stray non-whitespace characters outside matched tokens.
  let cursor = 0;
  for (const [start, end] of consumed) {
    const between = trimmed.slice(cursor, start);
    if (between.trim() !== '') return null;
    cursor = end;
  }
  if (trimmed.slice(cursor).trim() !== '') return null;

  const rounded = Math.round(total);
  return rounded;
}

/**
 * Format minutes back into a compact string: "1h 30m", "2d 3h", "45m".
 * Returns "—" for null/undefined so callers can render directly.
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return '—';
  if (!isFinite(minutes)) return '—';
  if (minutes === 0) return '0m';

  const sign = minutes < 0 ? '-' : '';
  const abs = Math.abs(Math.round(minutes));

  const days = Math.floor(abs / MINUTES_PER_DAY);
  const hours = Math.floor((abs % MINUTES_PER_DAY) / MINUTES_PER_HOUR);
  const mins = abs % MINUTES_PER_HOUR;

  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (mins) parts.push(`${mins}m`);
  return sign + (parts.length ? parts.join(' ') : '0m');
}

export interface Variance {
  diffMinutes: number;
  /** "+1h", "-30m", "On target" */
  label: string;
  /** Tailwind text color for subtle display */
  tone: 'over' | 'under' | 'on-target';
}

export function computeVariance(
  estimatedMinutes: number | null | undefined,
  actualMinutes: number | null | undefined
): Variance | null {
  if (
    estimatedMinutes === null ||
    estimatedMinutes === undefined ||
    actualMinutes === null ||
    actualMinutes === undefined
  ) {
    return null;
  }
  const diff = actualMinutes - estimatedMinutes;
  if (diff === 0) {
    return { diffMinutes: 0, label: 'On target', tone: 'on-target' };
  }
  const sign = diff > 0 ? '+' : '-';
  return {
    diffMinutes: diff,
    label: `${sign}${formatDuration(Math.abs(diff))}`,
    tone: diff > 0 ? 'over' : 'under',
  };
}
