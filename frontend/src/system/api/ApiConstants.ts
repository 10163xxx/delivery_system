// Business note: frontend API transport constants shared by all request helpers.
export const API_CLIENT_DEFAULTS = {
  backendUrl: 'http://127.0.0.1:8091',
  noContentStatus: 204,
  requestTimeoutMs: 8000,
} as const

export const API_HEADER = {
  contentType: 'Content-Type',
  jsonContentType: 'application/json',
  sessionToken: 'x-session-token',
} as const
