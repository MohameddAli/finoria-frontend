/**
 * Exponential backoff utility for retry logic
 * يحسب التأخير المتزايد لإعادة المحاولة
 * 
 * @param attempt - Current retry attempt (1-based)
 * @param baseDelay - Base delay in milliseconds (default: 500ms)
 * @param maxDelay - Maximum delay in milliseconds (default: 5000ms)
 * @returns Delay in milliseconds
 * 
 * @example
 * backoff(1) // 500ms
 * backoff(2) // 1000ms
 * backoff(3) // 2000ms
 * backoff(4) // 4000ms
 * backoff(5) // 5000ms (capped at maxDelay)
 */
export const backoff = (
  attempt: number,
  baseDelay: number = 500,
  maxDelay: number = 5000
): number => {
  // Exponential: baseDelay * 2^(attempt-1)
  const delay = baseDelay * Math.pow(2, attempt - 1)
  
  // Cap at maxDelay
  return Math.min(delay, maxDelay)
}

/**
 * Jittered exponential backoff for distributed systems
 * يضيف عشوائية لتجنب تزامن الطلبات
 * 
 * @param attempt - Current retry attempt
 * @param baseDelay - Base delay in milliseconds
 * @param maxDelay - Maximum delay in milliseconds
 * @returns Randomized delay in milliseconds
 */
export const backoffWithJitter = (
  attempt: number,
  baseDelay: number = 500,
  maxDelay: number = 5000
): number => {
  const delay = backoff(attempt, baseDelay, maxDelay)
  
  // Add random jitter ±25%
  const jitter = delay * 0.25
  const randomJitter = (Math.random() * 2 - 1) * jitter
  
  return Math.max(100, Math.floor(delay + randomJitter))
}
