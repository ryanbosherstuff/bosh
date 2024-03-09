/**
 * If message or error are provided, it will be logged natively by the app and the update skipped (url and version ignored by the app).
 */
export interface UpdateResponse {
  version: string,
  url: string,
  message?: string,
  error?: string
}
