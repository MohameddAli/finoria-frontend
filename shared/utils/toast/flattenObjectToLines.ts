/**
 * 🔧 Utility: Flatten nested objects to lines
 * ────────────────────────────────────────────
 *
 * تحويل Objects المعقدة إلى سطور نصية بسيطة
 *
 * @example
 * flattenObjectToLines({ user: { email: "test@test.com", name: "John" } })
 * // => ["user.email: test@test.com", "user.name: John"]
 *
 * @example
 * flattenObjectToLines({ errors: { email: ["taken", "invalid"] } })
 * // => ["errors.email: taken", "errors.email: invalid"]
 */

/**
 * فحص إذا كانت القيمة Object بسيط (ليس Array أو null)
 */
function isPlainObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

/**
 * تحويل Object معقد إلى سطور نصية
 */
export function flattenObjectToLines(
  obj: Record<string, unknown>,
  parentKey = ""
): string[] {
  const lines: string[] = [];

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    const value = obj[key];

    // قيمة بدائية (string, number, boolean)
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      lines.push(`${fullKey}: ${String(value)}`);
      continue;
    }

    // مصفوفة (Array)
    if (Array.isArray(value)) {
      for (const item of value) {
        if (
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean"
        ) {
          lines.push(`${fullKey}: ${String(item)}`);
        } else if (isPlainObject(item)) {
          // object داخل array
          lines.push(...flattenObjectToLines(item, fullKey));
        }
      }
      continue;
    }

    // object معقد
    if (isPlainObject(value)) {
      lines.push(...flattenObjectToLines(value, fullKey));
    }
  }

  return lines;
}
