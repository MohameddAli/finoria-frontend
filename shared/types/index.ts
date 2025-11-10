export type LocaleCode = 'en' | 'ar'

export interface Pagination {
  page: number
  pageSize: number
  total: number
}

export interface ErrorInfo {
  error: Error
  component?: string
  context?: string
  timestamp: Date
  statusCode?: number
  type: 'auth' | 'validation' | 'network' | 'server' | 'client' | 'unknown'
}

// Export API and entity types
export * from './api'
export * from './entities'


