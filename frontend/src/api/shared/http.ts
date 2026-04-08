const SESSION_STORAGE_KEY = 'delivery-session-token'
const REQUEST_TIMEOUT_MS = 8000

function getSessionToken() {
  return window.localStorage.getItem(SESSION_STORAGE_KEY)
}

export function saveSessionToken(token: string) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, token)
}

export function clearSessionToken() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}

export async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const sessionToken = getSessionToken()
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response

  try {
    response = await fetch(input, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(sessionToken ? { 'x-session-token': sessionToken } : {}),
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('请求超时，请确认后端服务已启动在 http://127.0.0.1:8081')
    }

    throw new Error('无法连接后端服务，请确认后端运行在 http://127.0.0.1:8081')
  } finally {
    window.clearTimeout(timeoutId)
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

export async function uploadRequest<T>(input: string, init?: RequestInit): Promise<T> {
  const sessionToken = getSessionToken()
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

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
      throw new Error('上传超时，请确认后端服务已启动在 http://127.0.0.1:8081')
    }

    throw new Error('无法连接后端服务，请确认后端运行在 http://127.0.0.1:8081')
  } finally {
    window.clearTimeout(timeoutId)
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}
