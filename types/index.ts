export interface API_RESPON<T=unknown> {
  message: string
  success: boolean
  data?: T
  err?: unknown
  meta?: Record<string, unknown>
}
