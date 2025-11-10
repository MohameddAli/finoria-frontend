/**
 * 🎯 Utility: Pick Toast Type from HTTP Status
 * ────────────────────────────────────────────
 *
 * تحديد نوع Toast بناءً على HTTP Status Code
 *
 * @example
 * pickToastType(201) // => "success"
 * pickToastType(404) // => "error"
 * pickToastType(undefined) // => "info"
 */

export type ToastVariant = "success" | "error" | "warning" | "info";

/**
 * تحديد variant من HTTP status code
 */
export function pickToastType(statusCode?: number): ToastVariant {
  // لا يوجد status code
  if (statusCode === undefined || statusCode === null) {
    return "info";
  }

  // 2xx -> Success
  if (statusCode >= 200 && statusCode < 300) {
    return "success";
  }

  // 4xx/5xx -> Error
  if (statusCode >= 400 && statusCode < 600) {
    return "error";
  }

  // 3xx أو أي شيء آخر -> Info
  return "info";
}
