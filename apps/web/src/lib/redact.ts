export function redactSecrets(text: string): string {
  return text
    .replace(/(sk-[A-Za-z0-9]{20,})/g, "[REDACTED_API_KEY]")
    .replace(/(password\s*[:=]\s*\S+)/gi, "password=[REDACTED]")
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, "[REDACTED_CARD]")
    .replace(/(token\s*[:=]\s*\S+)/gi, "token=[REDACTED]")
    .replace(/(secret\s*[:=]\s*\S+)/gi, "secret=[REDACTED]")
}
