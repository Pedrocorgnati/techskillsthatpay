import { randomUUID } from "crypto";

type LogLevel = "info" | "warn" | "error";

type LogPayload = Record<string, unknown> & { message: string; level?: LogLevel; requestId?: string };

function log(level: LogLevel, payload: LogPayload) {
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    ...payload
  };
  // eslint-disable-next-line no-console
  console[level === "error" ? "error" : level](JSON.stringify(entry));
}

export function createRequestLogger(requestId?: string) {
  const id = requestId || randomUUID();
  return {
    requestId: id,
    info: (message: string, extra: Record<string, unknown> = {}) =>
      log("info", { message, requestId: id, ...extra }),
    warn: (message: string, extra: Record<string, unknown> = {}) =>
      log("warn", { message, requestId: id, ...extra }),
    error: (message: string, extra: Record<string, unknown> = {}) =>
      log("error", { message, requestId: id, ...extra })
  };
}

export function logError(message: string, extra: Record<string, unknown> = {}) {
  log("error", { message, ...extra });
}
