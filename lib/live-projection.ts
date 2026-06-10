export const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

/**
 * Projects an annual figure forward at a continuous compound growth rate, the
 * way the Worldometers live clocks do. `anchorMs` is when `base` was measured.
 */
export function projectGrowth(base: number, annualPercent: number | undefined, anchorMs: number, nowMs: number) {
  if (!annualPercent || nowMs <= anchorMs) {
    return base;
  }
  const years = (nowMs - anchorMs) / YEAR_MS;
  return base * Math.pow(1 + annualPercent / 100, years);
}

export function toEpoch(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? undefined : ms;
}
