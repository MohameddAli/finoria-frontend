/**
 * 🔍 Utility: Normalize Backend Messages
 * ────────────────────────────────────────────
 *
 * تطبيع رسائل Backend لتكون متسقة
 * يدعم جميع الصيغ الشائعة من API
 *
 * @example
 * normalizeBackendMessage({ msg: "Success!" })
 * // => { lines: ["Success!"] }
 *
 * @example
 * normalizeBackendMessage({ errors: { email: ["taken", "invalid"] } })
 * // => { lines: ["errors.email: taken", "errors.email: invalid"] }
 *
 * @example
 * normalizeBackendMessage({ data: { user: { email: "created", name: "updated" } } })
 * // => { lines: ["data.user.email: created", "data.user.name: updated"] }
 */

import { flattenObjectToLines } from "./flattenObjectToLines";

/**
 * المفاتيح المحتملة للرسائل في API responses
 */
const CANDIDATE_KEYS = [
  "msg",
  "message",
  "error",
  "errors",
  "detail",
  "details",
  "info",
  "data",
  "status",
  "statusText",
] as const;

/**
 * فحص إذا كانت القيمة object بسيط
 */
function isPlainObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

/**
 * استخراج القيمة الخام من payload
 */
function pickRawValue(payload: unknown): unknown {
  if (payload === null || typeof payload === "undefined") {
    return undefined;
  }

  // إذا كان payload object، ابحث عن المفاتيح المعروفة
  if (isPlainObject(payload)) {
    for (const key of CANDIDATE_KEYS) {
      const value = payload[key];
      if (value !== undefined && value !== null) {
        return value;
      }
    }
  }

  // إذا كان payload نفسه قيمة بدائية، استخدمه
  if (
    typeof payload === "string" ||
    typeof payload === "number" ||
    typeof payload === "boolean"
  ) {
    return payload;
  }

  return undefined;
}

/**
 * تطبيع أي response من backend إلى سطور متسقة
 */
export function normalizeBackendMessage(payload: unknown): { lines: string[] } {
  const raw = pickRawValue(payload);

  // لم نجد أي شيء
  if (typeof raw === "undefined") {
    return { lines: ["عملية مكتملة"] }; // fallback باللغة العربية
  }

  // قيمة بدائية
  if (
    typeof raw === "string" ||
    typeof raw === "number" ||
    typeof raw === "boolean"
  ) {
    return { lines: [String(raw)] };
  }

  // مصفوفة
  if (Array.isArray(raw)) {
    return {
      lines: raw.map((item) => String(item)),
    };
  }

  // object
  if (isPlainObject(raw)) {
    const lines = flattenObjectToLines(raw);
    if (lines.length > 0) {
      return { lines };
    }
  }

  // fallback نهائي
  return { lines: ["عملية مكتملة"] };
}
