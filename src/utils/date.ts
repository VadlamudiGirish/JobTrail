/**
 * Take either a “YYYY-MM-DD” string or a full ISO string
 * and return a UTC‐midnight Date object (no TZ shift).
 */
export function toUTCDate(input: string): Date {
  // strip off any time if present (i.e. “2025-06-17T00:00:00.000Z” → “2025-06-17”)
  const [datePart] = input.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Convert a “YYYY-MM-DD” string into a Prisma‐safe ISO datetime
 * (always UTC midnight).
 */
export function toUTCISOString(input: string): string {
  return toUTCDate(input).toISOString();
}
