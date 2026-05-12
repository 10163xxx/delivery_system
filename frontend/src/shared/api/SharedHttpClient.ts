import { browserStorage } from '@/shared/api/BrowserStorage'

const HTTP_CLIENT_DEFAULTS = {
  backendUrl: 'http://127.0.0.1:8081',
  noContentStatus: 204,
  requestTimeoutMs: 8000,
} as const

const HTTP_CLIENT_MESSAGES = {
  requestTimeout: `请求超时，请确认后端服务已启动在 ${HTTP_CLIENT_DEFAULTS.backendUrl}`,
  uploadTimeout: `上传超时，请确认后端服务已启动在 ${HTTP_CLIENT_DEFAULTS.backendUrl}`,
  backendUnavailable: `无法连接后端服务，请确认后端运行在 ${HTTP_CLIENT_DEFAULTS.backendUrl}`,
} as const

type JsonGetEndpoint<Response> = {
  readonly path: string
  readonly method: 'GET'
  readonly kind: 'json'
  readonly __response?: Response
}

type JsonPostEndpoint<Body, Response> = {
  readonly path: string
  readonly method: 'POST'
  readonly kind: 'json'
  readonly __request?: Body
  readonly __response?: Response
}

type UploadPostEndpoint<Response> = {
  readonly path: string
  readonly method: 'POST'
  readonly kind: 'upload'
  readonly __response?: Response
}

export function defineJsonGetEndpoint<Response>(path: string): JsonGetEndpoint<Response> {
  return { path, method: 'GET', kind: 'json' }
}

export function defineJsonPostEndpoint<Body, Response>(path: string): JsonPostEndpoint<Body, Response> {
  return { path, method: 'POST', kind: 'json' }
}

export function defineUploadPostEndpoint<Response>(path: string): UploadPostEndpoint<Response> {
  return { path, method: 'POST', kind: 'upload' }
}

async function performRequest(input: string, init: RequestInit, timeoutMessage: string) {
  const sessionToken = browserStorage.readSessionToken()
  const controller = new AbortController()
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    HTTP_CLIENT_DEFAULTS.requestTimeoutMs,
  )

  let response: Response

  try {
    response = await fetch(input, {
      ...init,
      headers: {
        ...(sessionToken ? { 'x-session-token': sessionToken } : {}),
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(timeoutMessage)
    }

    throw new Error(HTTP_CLIENT_MESSAGES.backendUnavailable)
  } finally {
    window.clearTimeout(timeoutId)
  }

  return response
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if (response.status === HTTP_CLIENT_DEFAULTS.noContentStatus) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

export const httpClient = {
  getJson<Response>(endpoint: JsonGetEndpoint<Response>) {
    return performRequest(endpoint.path, { method: endpoint.method }, HTTP_CLIENT_MESSAGES.requestTimeout)
      .then((response) => parseJsonResponse<Response>(response))
  },
  postJson<Body, Response>(endpoint: JsonPostEndpoint<Body, Response>, body: Body) {
    return performRequest(
      endpoint.path,
      {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      HTTP_CLIENT_MESSAGES.requestTimeout,
    ).then((response) => parseJsonResponse<Response>(response))
  },
  postWithoutBody<Response>(endpoint: JsonPostEndpoint<void, Response>) {
    return performRequest(
      endpoint.path,
      {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
      },
      HTTP_CLIENT_MESSAGES.requestTimeout,
    ).then((response) => parseJsonResponse<Response>(response))
  },
  postFormData<Response>(endpoint: UploadPostEndpoint<Response>, body: FormData) {
    return performRequest(
      endpoint.path,
      {
        method: endpoint.method,
        body,
      },
      HTTP_CLIENT_MESSAGES.uploadTimeout,
    ).then((response) => parseJsonResponse<Response>(response))
  },
}
