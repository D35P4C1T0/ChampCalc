export const MAX_SHOWDOWN_TEXT_LENGTH = 10_000;

const DISALLOWED_TEXT_CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const UNSIGNED_INTEGER_PATTERN = /^\d+$/;

export function sanitizeShowdownText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(DISALLOWED_TEXT_CONTROL_CHARS, "")
    .trim();
}

export function sanitizeShowdownTextInput(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  return sanitizeShowdownText(value);
}

export function sanitizeUnsignedIntegerInput(value: unknown): unknown {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return Number.NaN;
    }

    return Math.trunc(value);
  }

  if (typeof value !== "string") {
    return Number.NaN;
  }

  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }

  if (!UNSIGNED_INTEGER_PATTERN.test(trimmed)) {
    return Number.NaN;
  }

  return Number.parseInt(trimmed, 10);
}
