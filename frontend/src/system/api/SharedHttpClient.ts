import { readSessionToken } from '@/system/api/BrowserStorage'
import { API_CLIENT_DEFAULTS, API_HEADER } from '@/system/api/ApiConstants'
import type { Decoder } from '@/system/api/ResponseDecoders'
import type {
  JsonGetEndpoint,
  JsonPostEndpoint,
  UploadPostEndpoint,
} from '@/system/api/TypedApiDefinitions'

const HTTP_CLIENT_DEFAULTS = {
  backendUrl: API_CLIENT_DEFAULTS.backendUrl,
  noContentStatus: API_CLIENT_DEFAULTS.noContentStatus,
  requestTimeoutMs: API_CLIENT_DEFAULTS.requestTimeoutMs,
} as const

const HTTP_CLIENT_MESSAGES = {
  requestTimeout: `请求超时，请确认后端服务已启动在 ${HTTP_CLIENT_DEFAULTS.backendUrl}`,
  uploadTimeout: `上传超时，请确认后端服务已启动在 ${HTTP_CLIENT_DEFAULTS.backendUrl}`,
  backendUnavailable: `无法连接后端服务，请确认后端运行在 ${HTTP_CLIENT_DEFAULTS.backendUrl}`,
} as const

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
  const sessionToken = readSessionToken()
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
        ...(sessionToken ? { [API_HEADER.sessionToken]: sessionToken } : {}),
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

async function parseJsonResponse(response: Response): Promise<unknown> {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if (response.status === HTTP_CLIENT_DEFAULTS.noContentStatus) {
    return undefined
  }

  const text = await response.text()
  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('后端返回了无效的 JSON 响应')
  }
}

export function getJson<Response>(
  endpoint: JsonGetEndpoint<Response>,
  decodeResponse: Decoder<Response>,
) {
  return performRequest(endpoint.path, { method: endpoint.method }, HTTP_CLIENT_MESSAGES.requestTimeout)
    .then((response) => parseJsonResponse(response))
    .then((value) => decodeResponse(value))
}

export function postJson<Body, Response>(
  endpoint: JsonPostEndpoint<Body, Response>,
  body: Body,
  decodeResponse: Decoder<Response>,
) {
  return performRequest(
    endpoint.path,
    {
      method: endpoint.method,
      headers: { [API_HEADER.contentType]: API_HEADER.jsonContentType },
      body: JSON.stringify(body),
    },
    HTTP_CLIENT_MESSAGES.requestTimeout,
  ).then((response) => parseJsonResponse(response))
    .then((value) => decodeResponse(value))
}

export function postWithoutBody<Response>(
  endpoint: JsonPostEndpoint<void, Response>,
  decodeResponse: Decoder<Response>,
) {
  return performRequest(
    endpoint.path,
    {
      method: endpoint.method,
      headers: { [API_HEADER.contentType]: API_HEADER.jsonContentType },
    },
    HTTP_CLIENT_MESSAGES.requestTimeout,
  ).then((response) => parseJsonResponse(response))
    .then((value) => decodeResponse(value))
}

export function postFormData<Response>(
  endpoint: UploadPostEndpoint<Response>,
  body: FormData,
  decodeResponse: Decoder<Response>,
) {
  return performRequest(
    endpoint.path,
    {
      method: endpoint.method,
      body,
    },
    HTTP_CLIENT_MESSAGES.uploadTimeout,
  ).then((response) => parseJsonResponse(response))
    .then((value) => decodeResponse(value))
}
