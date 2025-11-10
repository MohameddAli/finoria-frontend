/**
 * API Response Types
 * Shared interfaces for API communication
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T
}

/**
 * Error response structure
 */
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
